import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import { IdentityType } from '@/lib/core/entity/account';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Revokes an identity from an account (DELETE /accounts/{account}/identities). Rucio reads the identity from the JSON body of the DELETE.
 */
export default class DeleteAccountIdentityEndpoint extends BaseEndpoint<AccountMutationDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly account: string,
        private readonly identity: string,
        private readonly type: IdentityType,
    ) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'DELETE',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}/identities`,
            headers: { 'X-Rucio-Auth-Token': this.rucioAuthToken, 'Content-Type': 'application/json' },
            body: { identity: this.identity, authtype: this.type },
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
