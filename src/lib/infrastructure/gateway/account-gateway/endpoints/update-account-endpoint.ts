import { AccountMutationDTO } from '@/lib/core/dto/account-dto';
import { AccountUpdateOptions } from '@/lib/core/entity/account';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Updates an account (PUT /accounts/{account}). Only the keys that are defined in the options are sent.
 */
export default class UpdateAccountEndpoint extends BaseEndpoint<AccountMutationDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly account: string, private readonly options: AccountUpdateOptions) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'PUT',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}`,
            headers: { 'X-Rucio-Auth-Token': this.rucioAuthToken, 'Content-Type': 'application/json' },
            body: this.buildBody(),
        };
        this.request = request;
        this.initialized = true;
    }

    private buildBody(): Record<string, string | null> {
        const body: Record<string, string | null> = {};
        if (this.options.status !== undefined) body.status = this.options.status;
        if (this.options.email !== undefined) body.email = this.options.email;
        if (this.options.accountType !== undefined) body.account_type = this.options.accountType;
        return body;
    }

    async reportErrors(): Promise<AccountMutationDTO | undefined> {
        return undefined; // handled by handleCommonGatewayEndpointErrors
    }

    createDTO(): AccountMutationDTO {
        return { status: 'success' };
    }
}
