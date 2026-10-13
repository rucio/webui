import { Readable } from 'stream';
import GetAccountQuotasUseCase, { mergeGlobalQuotas, mergeLocalQuotas } from '@/lib/core/use-case/get-account-quotas-usecase';
import {
    AccountGlobalLimitDTO,
    AccountGlobalUsageDTO,
    AccountRSELimitDTO,
    AccountRSEUsageDTO,
    ListAccountRSEUsageDTO,
} from '@/lib/core/dto/account-dto';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';
import { GetAccountQuotasOutputPort } from '@/lib/core/port/primary/get-account-quotas-ports';
import {
    GetAccountQuotasError,
    GetAccountQuotasRequest,
    GetAccountQuotasResponse,
} from '@/lib/core/usecase-models/get-account-quotas-usecase-models';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

const usageRow = (rse: string, usedBytes: number, files = 1): AccountRSEUsageDTO =>
    ({ status: 'success', account: 'jdoe', rse_id: `id-${rse}`, rse, used_bytes: usedBytes, files, bytes_limit: 0 } as AccountRSEUsageDTO);

const limitsDTO = (limits: Record<string, number>): AccountRSELimitDTO => ({ status: 'success', account: 'jdoe', limits });
const usageDTO = (rows: AccountRSEUsageDTO[]): ListAccountRSEUsageDTO => ({ status: 'success', stream: Readable.from(rows) });
const globalLimitsDTO = (limits: AccountGlobalLimitDTO['limits']): AccountGlobalLimitDTO => ({ status: 'success', account: 'jdoe', limits });
const globalUsageDTO = (usage: AccountGlobalUsageDTO['usage']): AccountGlobalUsageDTO => ({ status: 'success', account: 'jdoe', usage });

type Gateway = {
    limits?: AccountRSELimitDTO;
    usage?: ListAccountRSEUsageDTO;
    globalLimits?: AccountGlobalLimitDTO;
    globalUsage?: AccountGlobalUsageDTO;
};

async function run(g: Gateway): Promise<{ responses: GetAccountQuotasResponse[]; errors: GetAccountQuotasError[] }> {
    const gateway = {
        getAccountRSELimits: jest.fn().mockResolvedValue(g.limits ?? limitsDTO({})),
        listAccountRSEUsage: jest.fn().mockResolvedValue(g.usage ?? usageDTO([])),
        getAccountGlobalLimits: jest.fn().mockResolvedValue(g.globalLimits ?? globalLimitsDTO({})),
        listAccountGlobalUsage: jest.fn().mockResolvedValue(g.globalUsage ?? globalUsageDTO([])),
    } as unknown as AccountGatewayOutputPort;

    const responses: GetAccountQuotasResponse[] = [];
    const errors: GetAccountQuotasError[] = [];
    const presenter = {
        presentSuccess: async (r: GetAccountQuotasResponse) => {
            responses.push(r);
        },
        presentError: async (e: GetAccountQuotasError) => {
            errors.push(e);
        },
    } as unknown as GetAccountQuotasOutputPort;

    const request: AuthenticatedRequestModel<GetAccountQuotasRequest> = { rucioAuthToken: 'token', account: 'jdoe' };
    await new GetAccountQuotasUseCase(presenter, gateway).execute(request);
    return { responses, errors };
}

describe('GetAccountQuotasUseCase', () => {
    it('keeps usage without a limit row (bytesLimit null)', async () => {
        const { responses } = await run({ usage: usageDTO([usageRow('XRD1', 5)]) });
        expect(responses[0].local).toEqual([{ rse: 'XRD1', rseId: 'id-XRD1', bytesLimit: null, bytesUsed: 5, files: 1, bytesRemaining: null }]);
    });

    it('keeps a limit without usage (zero used)', async () => {
        const { responses } = await run({ limits: limitsDTO({ XRD2: 100 }) });
        expect(responses[0].local).toEqual([{ rse: 'XRD2', bytesLimit: 100, bytesUsed: 0, files: 0, bytesRemaining: 100 }]);
    });

    it('reports an unlimited RSE with bytesRemaining null', async () => {
        const { responses } = await run({ limits: limitsDTO({ XRD1: -1 }), usage: usageDTO([usageRow('XRD1', 7)]) });
        expect(responses[0].local[0]).toMatchObject({ rse: 'XRD1', bytesLimit: -1, bytesUsed: 7, bytesRemaining: null });
    });

    it('merges the global limits with the global usage', async () => {
        const { responses } = await run({
            globalLimits: globalLimitsDTO({ 'tier=1': { resolvedRses: ['A', 'B'], limit: 10 } }),
            globalUsage: globalUsageDTO([{ rseExpression: 'tier=1', bytes: 4, files: 2, bytesLimit: 10, bytesRemaining: 6 }]),
        });
        expect(responses[0].global).toEqual([
            { rseExpression: 'tier=1', resolvedRses: ['A', 'B'], bytesLimit: 10, bytesUsed: 4, files: 2, bytesRemaining: 6 },
        ]);
    });

    it('returns the error of a failing call and no partial data', async () => {
        const { responses, errors } = await run({
            limits: limitsDTO({ XRD1: 10 }),
            globalLimits: { status: 'error', account: 'jdoe', limits: {}, errorCode: 404, errorName: 'Not Found', errorMessage: 'no such account' },
        });
        expect(responses).toHaveLength(0);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toMatchObject({ status: 'error', code: 404 });
    });

    it('returns an error when the usage stream fails', async () => {
        const failing = new Readable({
            objectMode: true,
            read() {
                this.destroy(new Error('stream broke'));
            },
        });
        const { responses, errors } = await run({ usage: { status: 'success', stream: failing } });
        expect(responses).toHaveLength(0);
        expect(errors[0]).toMatchObject({ status: 'error', code: 500 });
    });
});

describe('mergeLocalQuotas / mergeGlobalQuotas', () => {
    it('treats an Infinity limit from the legacy gateway as unlimited', () => {
        const rows = mergeLocalQuotas({ A: Infinity }, [usageRow('A', 3)]);
        expect(rows[0]).toMatchObject({ bytesLimit: -1, bytesUsed: 3, bytesRemaining: null });
    });

    it('sorts local rows by RSE name', () => {
        const rows = mergeLocalQuotas({ B: 1, A: 1 }, [usageRow('C', 1)]);
        expect(rows.map(r => r.rse)).toEqual(['A', 'B', 'C']);
    });

    it('computes global remaining only for finite limits', () => {
        const rows = mergeGlobalQuotas({ a: { resolvedRses: [], limit: 10 }, b: { resolvedRses: [], limit: -1 } }, [
            { rseExpression: 'a', bytes: 3, files: 1, bytesLimit: 10, bytesRemaining: 7 },
            { rseExpression: 'b', bytes: 3, files: 1, bytesLimit: -1, bytesRemaining: -1 },
            { rseExpression: 'c', bytes: 3, files: 1, bytesLimit: -1, bytesRemaining: -1 },
        ]);
        expect(rows.map(r => [r.rseExpression, r.bytesLimit, r.bytesRemaining])).toEqual([
            ['a', 10, 7],
            ['b', -1, null],
            ['c', null, null],
        ]);
    });
});
