import GetPandaTaskLinkUseCase from '@/lib/core/use-case/get-panda-task-link-usecase';
import { GetPandaTaskLinkOutputPort } from '@/lib/core/port/primary/get-panda-task-link-ports';
import { GetPandaTaskLinkError, GetPandaTaskLinkResponse } from '@/lib/core/usecase-models/get-panda-task-link-usecase-models';
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import { Signal } from '@/lib/sdk/web';

async function run(taskId: string, baseUrl?: string) {
    const calls: { success?: GetPandaTaskLinkResponse; error?: GetPandaTaskLinkError } = {};
    const presenter: GetPandaTaskLinkOutputPort = {
        response: undefined as unknown as Signal,
        async presentSuccess(model: GetPandaTaskLinkResponse) {
            calls.success = model;
        },
        async presentError(model: GetPandaTaskLinkError) {
            calls.error = model;
        },
    };
    const env = { get: jest.fn(async (key: string) => (key === 'PANDA_BASE_URL' ? baseUrl : undefined)) } as unknown as EnvConfigGatewayOutputPort;
    await new GetPandaTaskLinkUseCase(presenter, env).execute({ rucioAuthToken: 't', taskId });
    return calls;
}

describe('GetPandaTaskLinkUseCase', () => {
    it('returns the BigPanDA link with the default base URL', async () => {
        expect((await run('34870879')).success).toEqual({
            status: 'success',
            taskId: '34870879',
            url: 'https://bigpanda.cern.ch/task/?jeditaskid=34870879',
        });
    });

    it('uses PANDA_BASE_URL when set', async () => {
        expect((await run('1', 'https://panda.example.org/')).success?.url).toBe('https://panda.example.org/task/?jeditaskid=1');
    });

    it.each(['', 'abc', '1234567890123'])('rejects %p with InvalidTaskIdError 400', async taskId => {
        expect((await run(taskId)).error).toMatchObject({ status: 'error', type: 'InvalidTaskIdError', code: 400 });
    });
});
