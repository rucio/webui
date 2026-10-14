import { AccountGlobalUsageDTO } from '@/lib/core/dto/account-dto';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { parseNDJSON, TRucioGlobalUsage } from '../account-gateway-utils';

/**
 * Lists the global (RSE expression) usage of an account (GET /accounts/{account}/usage/global, NDJSON).
 * Rucio's `Infinity` values arrive as -1 (unlimited). An empty body means no global limits.
 */
export default class ListAccountGlobalUsageEndpoint extends BaseEndpoint<AccountGlobalUsageDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly account: string) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'GET',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}/usage/global`,
            headers: { 'X-Rucio-Auth-Token': this.rucioAuthToken, Accept: 'application/x-json-stream' },
            body: null,
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(): Promise<AccountGlobalUsageDTO | undefined> {
        return undefined; // handled by handleCommonGatewayEndpointErrors
    }

    createDTO(data: string): AccountGlobalUsageDTO {
        const usage = parseNDJSON<TRucioGlobalUsage>(data).map(u => ({
            rseExpression: u.rse_expression,
            bytes: u.bytes,
            files: u.files,
            bytesLimit: u.bytes_limit,
            bytesRemaining: u.bytes_remaining,
        }));
        return { status: 'success', account: this.account, usage };
    }
}
