import { AccountAttributeListDTO } from '@/lib/core/dto/account-dto';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

/**
 * Lists the attributes of an account (GET /accounts/{account}/attr/). The trailing slash is required,
 * otherwise Rucio answers with a redirect that drops non-default ports.
 */
export default class GetAccountAttributesEndpoint extends BaseEndpoint<AccountAttributeListDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly account: string) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'GET',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}/attr/`,
            headers: { 'X-Rucio-Auth-Token': this.rucioAuthToken, Accept: 'application/json' },
            body: null,
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(): Promise<AccountAttributeListDTO | undefined> {
        return undefined; // handled by handleCommonGatewayEndpointErrors
    }

    createDTO(data: { key: string; value: string | boolean }[]): AccountAttributeListDTO {
        const attributes = (data ?? []).map(a => ({ key: a.key, value: a.value }));
        return { status: 'success', account: this.account, attributes };
    }
}
