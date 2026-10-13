import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import { IdentityType } from '@/lib/core/entity/account';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Grants an identity to an account (POST /accounts/{account}/identities). The body can contain a password and must never be logged.
 */
export default class AddAccountIdentityEndpoint extends BaseEndpoint<AccountMutationDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly account: string,
        private readonly identity: string,
        private readonly type: IdentityType,
        private readonly email: string,
        private readonly password?: string,
        private readonly isDefault: boolean = false,
    ) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'POST',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}/identities`,
            headers: { 'X-Rucio-Auth-Token': this.rucioAuthToken, 'Content-Type': 'application/json' },
            body: this.buildBody(),
        };
        this.request = request;
        this.initialized = true;
    }

    private buildBody(): Record<string, string | boolean> {
        const body: Record<string, string | boolean> = {
            identity: this.identity,
            authtype: this.type,
            email: this.email,
            default: this.isDefault,
        };
        if (this.password !== undefined) body.password = this.password;
        return body;
    }

    async reportErrors(): Promise<AccountMutationDTO | undefined> {
        return undefined; // handled by handleCommonGatewayEndpointErrors
    }

    createDTO(): AccountMutationDTO {
        return { status: 'success' };
    }
}
