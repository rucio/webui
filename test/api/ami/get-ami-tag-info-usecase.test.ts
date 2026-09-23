import GetAMITagInfoUseCase from '@/lib/core/use-case/get-ami-tag-info-usecase';
import { GetAMITagInfoOutputPort } from '@/lib/core/port/primary/get-ami-tag-info-ports';
import { GetAMITagInfoError, GetAMITagInfoResponse } from '@/lib/core/usecase-models/get-ami-tag-info-usecase-models';
import AMIGatewayOutputPort from '@/lib/core/port/secondary/ami-gateway-output-port';
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import { AMITagInfoDTO } from '@/lib/core/dto/ami-dto';
import { Signal } from '@/lib/sdk/web';

function makePresenter() {
    const calls: { success?: GetAMITagInfoResponse; error?: GetAMITagInfoError } = {};
    const presenter: GetAMITagInfoOutputPort = {
        response: undefined as unknown as Signal,
        async presentSuccess(model: GetAMITagInfoResponse) {
            calls.success = model;
        },
        async presentError(model: GetAMITagInfoError) {
            calls.error = model;
        },
    };
    return { presenter, calls };
}

function makeEnv(baseUrl?: string): EnvConfigGatewayOutputPort {
    return { get: jest.fn(async (key: string) => (key === 'AMI_BASE_URL' ? baseUrl : undefined)) } as unknown as EnvConfigGatewayOutputPort;
}

function makeGateway(impl: (tag: string) => Promise<AMITagInfoDTO>): AMIGatewayOutputPort & { getTagInfo: jest.Mock } {
    return { getTagInfo: jest.fn((_base: string, tag: string) => impl(tag)) };
}

const run = async (tags: string[], gateway: AMIGatewayOutputPort, env = makeEnv()) => {
    const { presenter, calls } = makePresenter();
    await new GetAMITagInfoUseCase(presenter, gateway, env).execute({ rucioAuthToken: 't', tags });
    return calls;
};

describe('GetAMITagInfoUseCase', () => {
    it('returns details, not-found and unavailable tags side by side with links', async () => {
        const gateway = makeGateway(async tag => {
            if (tag === 'm2281') return { status: 'success', tag, found: true, productionStep: 'merge', baseRelease: 'Athena_24.0.128' };
            if (tag === 'f9999') return { status: 'success', tag, found: false };
            return { status: 'error', tag, found: false, errorCode: 503, errorMessage: 'down' };
        });
        const calls = await run(['m2281', 'f9999', 'r1234'], gateway);

        expect(calls.error).toBeUndefined();
        expect(calls.success).toEqual({
            status: 'success',
            tags: [
                {
                    tag: 'm2281',
                    url: 'https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=m2281',
                    found: true,
                    productionStep: 'merge',
                    baseRelease: 'Athena_24.0.128',
                },
                { tag: 'f9999', url: 'https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=f9999', found: false },
                { tag: 'r1234', url: 'https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=r1234', found: null },
            ],
        });
    });

    it('treats a rejected gateway promise as unavailable', async () => {
        const calls = await run(
            ['f1723'],
            makeGateway(async () => Promise.reject(new Error('boom'))),
        );
        expect(calls.success?.tags).toEqual([{ tag: 'f1723', url: 'https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=f1723', found: null }]);
    });

    it('uses AMI_BASE_URL (normalized) for both lookups and links', async () => {
        const gateway = makeGateway(async tag => ({ status: 'success', tag, found: false }));
        const calls = await run(['f1723'], gateway, makeEnv(' https://ami.example.org/ '));
        expect(gateway.getTagInfo).toHaveBeenCalledWith('https://ami.example.org', 'f1723');
        expect(calls.success?.tags[0].url).toBe('https://ami.example.org/?subapp=tagsShow&userdata=f1723');
    });

    it('falls back to the default base URL when AMI_BASE_URL is blank', async () => {
        const gateway = makeGateway(async tag => ({ status: 'success', tag, found: false }));
        await run(['f1723'], gateway, makeEnv('  '));
        expect(gateway.getTagInfo).toHaveBeenCalledWith('https://atlas-ami.cern.ch', 'f1723');
    });

    it.each<[string, string[]]>([
        ['empty', []],
        ['invalid tag', ['AOD']],
        ['too many', Array.from({ length: 11 }, (_, i) => `f${1000 + i}`)],
    ])('rejects %s input with InvalidTagsError 400 and never calls AMI', async (_label, tags) => {
        const gateway = makeGateway(async tag => ({ status: 'success', tag, found: true }));
        const calls = await run(tags, gateway);
        expect(calls.error).toMatchObject({ status: 'error', type: 'InvalidTagsError', code: 400 });
        expect(gateway.getTagInfo).not.toHaveBeenCalled();
    });
});
