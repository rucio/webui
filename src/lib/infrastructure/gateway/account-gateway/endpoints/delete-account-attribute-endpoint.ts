import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Removes an attribute from an account (DELETE /accounts/{account}/attr/{key}).
 */
export default class DeleteAccountAttributeEndpoint extends BaseEndpoint<AccountMutationDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly account: string, private readonly key: string) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'DELETE',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}/attr/${encodeURIComponent(this.key)}`,
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
