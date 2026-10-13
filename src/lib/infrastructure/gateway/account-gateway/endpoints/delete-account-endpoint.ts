import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Deletes an account (DELETE /accounts/{account}).
 */
export default class DeleteAccountEndpoint extends BaseEndpoint<AccountMutationDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly account: string) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'DELETE',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}`,
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
