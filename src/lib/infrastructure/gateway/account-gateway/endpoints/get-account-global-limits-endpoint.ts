import { AccountGlobalLimitDTO } from '@/lib/core/dto/account-dto';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { TRucioGlobalLimits } from '../account-gateway-utils';

/**
 * Lists the global (RSE expression) limits of an account (GET /accounts/{account}/limits/global).
 * Rucio's `Infinity` limits arrive as -1 (unlimited).
 */
export default class GetAccountGlobalLimitsEndpoint extends BaseEndpoint<AccountGlobalLimitDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly account: string) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'GET',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}/limits/global`,
            headers: { 'X-Rucio-Auth-Token': this.rucioAuthToken, Accept: 'application/json' },
            body: null,
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(): Promise<AccountGlobalLimitDTO | undefined> {
        return undefined; // handled by handleCommonGatewayEndpointErrors
    }

    createDTO(data: TRucioGlobalLimits): AccountGlobalLimitDTO {
        const limits: AccountGlobalLimitDTO['limits'] = {};
        for (const [expression, value] of Object.entries(data ?? {})) {
            limits[expression] = { resolvedRses: value.resolved_rses ?? [], limit: value.limit };
        }
        return { status: 'success', account: this.account, limits };
    }
}
