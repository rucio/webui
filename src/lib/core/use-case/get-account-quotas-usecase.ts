import { injectable } from 'inversify';
import { BaseSingleEndpointUseCase } from '@/lib/sdk/usecase';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { collectStreamedData } from '@/lib/sdk/utils';

import {
    GetAccountQuotasError,
    GetAccountQuotasRequest,
    GetAccountQuotasResponse,
} from '@/lib/core/usecase-models/get-account-quotas-usecase-models';
import { GetAccountQuotasInputPort, type GetAccountQuotasOutputPort } from '@/lib/core/port/primary/get-account-quotas-ports';

import { AccountGlobalLimitDTO, AccountGlobalUsageDTO, AccountQuotasDTO, AccountRSEUsageDTO } from '@/lib/core/dto/account-dto';
import { AccountGlobalQuota, AccountLocalQuota } from '@/lib/core/entity/account';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

/** Limit value Rucio uses for "unlimited". */
const UNLIMITED = -1;

/** The legacy limits endpoint reports unlimited as Infinity (null after JSON); normalise it to -1. */
const normalizeLimit = (limit: number | null): number => (limit === null || !Number.isFinite(limit) ? UNLIMITED : limit);

/**
 * Merges the per-RSE limits with the per-RSE usage. A row exists for every RSE that has a limit or usage.
 * bytesLimit is null when the RSE has no limit row, -1 when unlimited. bytesRemaining is null in both cases.
 */
export function mergeLocalQuotas(limits: Record<string, number>, usage: AccountRSEUsageDTO[]): AccountLocalQuota[] {
    const rows = new Map<string, AccountLocalQuota>();
    Object.entries(limits).forEach(([rse, rawLimit]) => {
        const limit = normalizeLimit(rawLimit);
        rows.set(rse, { rse, bytesLimit: limit, bytesUsed: 0, files: 0, bytesRemaining: limit === UNLIMITED ? null : limit });
    });
    usage.forEach(u => {
        const limit = rows.get(u.rse)?.bytesLimit ?? null;
        rows.set(u.rse, {
            rse: u.rse,
            rseId: u.rse_id,
            bytesLimit: limit,
            bytesUsed: u.used_bytes,
            files: u.files,
            bytesRemaining: limit === null || limit === UNLIMITED ? null : limit - u.used_bytes,
        });
    });
    return Array.from(rows.values()).sort((a, b) => a.rse.localeCompare(b.rse));
}

/**
 * Merges the global limits (per RSE expression) with the global usage. A row exists for every expression
 * that has a limit or usage. bytesRemaining is limit - used unless the limit is -1 or null (then null).
 */
export function mergeGlobalQuotas(limits: AccountGlobalLimitDTO['limits'], usage: AccountGlobalUsageDTO['usage']): AccountGlobalQuota[] {
    const rows = new Map<string, AccountGlobalQuota>();
    Object.entries(limits).forEach(([rseExpression, { resolvedRses, limit }]) =>
        rows.set(rseExpression, {
            rseExpression,
            resolvedRses,
            bytesLimit: limit,
            bytesUsed: 0,
            files: 0,
            bytesRemaining: limit === UNLIMITED ? null : limit,
        }),
    );
    usage.forEach(u => {
        const existing = rows.get(u.rseExpression);
        const limit = existing?.bytesLimit ?? null;
        rows.set(u.rseExpression, {
            rseExpression: u.rseExpression,
            resolvedRses: existing?.resolvedRses ?? [],
            bytesLimit: limit,
            bytesUsed: u.bytes,
            files: u.files,
            bytesRemaining: limit === null || limit === UNLIMITED ? null : limit - u.bytes,
        });
    });
    return Array.from(rows.values()).sort((a, b) => a.rseExpression.localeCompare(b.rseExpression));
}

@injectable()
export default class GetAccountQuotasUseCase
    extends BaseSingleEndpointUseCase<
        AuthenticatedRequestModel<GetAccountQuotasRequest>,
        GetAccountQuotasResponse,
        GetAccountQuotasError,
        AccountQuotasDTO
    >
    implements GetAccountQuotasInputPort
{
    constructor(protected readonly presenter: GetAccountQuotasOutputPort, private readonly gateway: AccountGatewayOutputPort) {
        super(presenter);
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<GetAccountQuotasRequest>): GetAccountQuotasError | undefined {
        return undefined;
    }

    /**
     * Fans out to the four quota endpoints. Returns the first error DTO (no partial data), else a synthetic success DTO.
     */
    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<GetAccountQuotasRequest>): Promise<AccountQuotasDTO> {
        const { rucioAuthToken, account } = requestModel;
        const [limitsDTO, usageDTO, globalLimitsDTO, globalUsageDTO] = await Promise.all([
            this.gateway.getAccountRSELimits(account, rucioAuthToken),
            this.gateway.listAccountRSEUsage(account, rucioAuthToken),
            this.gateway.getAccountGlobalLimits(rucioAuthToken, account),
            this.gateway.listAccountGlobalUsage(rucioAuthToken, account),
        ]);

        for (const dto of [limitsDTO, usageDTO, globalLimitsDTO, globalUsageDTO]) {
            if (dto.status === 'error') {
                // The usage stream is already open and will not be consumed: release it.
                usageDTO.stream?.destroy?.();
                return { ...dto, account, local: [], global: [] };
            }
        }
        if (!usageDTO.stream) {
            return {
                status: 'error',
                account,
                local: [],
                global: [],
                errorCode: 500,
                errorName: 'UseCase Error',
                errorMessage: 'Could not get the usage stream from the gateway',
            };
        }

        let usage: AccountRSEUsageDTO[];
        try {
            usage = await collectStreamedData<AccountRSEUsageDTO>(usageDTO.stream);
        } catch (error) {
            return { status: 'error', account, local: [], global: [], errorCode: 500, errorName: 'Exception', errorMessage: String(error) };
        }
        const failed = usage.find(u => u.status === 'error');
        if (failed) {
            return { ...failed, account, local: [], global: [] };
        }

        return {
            status: 'success',
            account,
            local: mergeLocalQuotas(limitsDTO.limits, usage),
            global: mergeGlobalQuotas(globalLimitsDTO.limits, globalUsageDTO.usage),
        };
    }

    handleGatewayError(error: AccountQuotasDTO): GetAccountQuotasError {
        return {
            status: 'error',
            message: error.errorMessage ? error.errorMessage : 'Gateway Error',
            name: error.errorClass ?? error.errorName,
            code: error.errorCode ?? 500,
        } as GetAccountQuotasError;
    }

    processDTO(dto: AccountQuotasDTO): { data: GetAccountQuotasResponse | GetAccountQuotasError; status: 'success' | 'error' } {
        const responseModel: GetAccountQuotasResponse = {
            status: 'success',
            account: dto.account,
            local: dto.local,
            global: dto.global,
        };
        return { status: 'success', data: responseModel };
    }
}
