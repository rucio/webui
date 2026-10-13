import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import { AccountType } from '@/lib/core/entity/rucio';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Creates an account (POST /accounts/{account}). Rucio requires the email key, so null is sent explicitly.
 */
export default class CreateAccountEndpoint extends BaseEndpoint<AccountMutationDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly account: string,
        private readonly accountType: AccountType,
        private readonly email: string | null,
    ) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'POST',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}`,
            headers: { 'X-Rucio-Auth-Token': this.rucioAuthToken, 'Content-Type': 'application/json' },
            body: { type: this.accountType, email: this.email },
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
