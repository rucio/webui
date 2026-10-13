import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Adds an attribute to an account (POST /accounts/{account}/attr/{key}).
 */
export default class AddAccountAttributeEndpoint extends BaseEndpoint<AccountMutationDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly account: string,
        private readonly key: string,
        private readonly value: string,
    ) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'POST',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}/attr/${encodeURIComponent(this.key)}`,
            headers: { 'X-Rucio-Auth-Token': this.rucioAuthToken, 'Content-Type': 'application/json' },
            body: { value: this.value },
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
