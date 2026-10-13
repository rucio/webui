import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import { AccountLimitLocality } from '@/lib/core/entity/account';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Removes a local or global quota (DELETE /accounts/{account}/limits/{locality}/{rse}).
 */
export default class DeleteAccountLimitEndpoint extends BaseEndpoint<AccountMutationDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly account: string,
        private readonly locality: AccountLimitLocality,
        private readonly rseExpression: string,
    ) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'DELETE',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}/limits/${this.locality}/${encodeURIComponent(this.rseExpression)}`,
            headers: { 'X-Rucio-Auth-Token': this.rucioAuthToken },
            body: null,
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
