import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import { AccountLimitLocality } from '@/lib/core/entity/account';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Sets a local (RSE) or global (RSE expression) quota (POST /accounts/{account}/limits/{locality}/{rse}). bytes -1 means unlimited.
 */
export default class SetAccountLimitEndpoint extends BaseEndpoint<AccountMutationDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly account: string,
        private readonly locality: AccountLimitLocality,
        private readonly rseExpression: string,
        private readonly bytes: number,
    ) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'POST',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}/limits/${this.locality}/${encodeURIComponent(this.rseExpression)}`,
            headers: { 'X-Rucio-Auth-Token': this.rucioAuthToken, 'Content-Type': 'application/json' },
            body: { bytes: this.bytes },
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(): Promise<AccountMutationDTO | undefined> {
        return undefined; // handled by handleCommonGatewayEndpointErrors
    }

    createDTO(): AccountMutationDTO {
        return { status: 'success' };
    }
}
