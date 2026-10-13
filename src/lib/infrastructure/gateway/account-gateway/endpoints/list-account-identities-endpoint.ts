import { AccountIdentityListDTO } from '@/lib/core/dto/account-dto';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { convertToIdentityType, parseNDJSON, TRucioAccountIdentity } from '../account-gateway-utils';

/**
 * Lists the identities mapped to an account (GET /accounts/{account}/identities, NDJSON).
 */
export default class ListAccountIdentitiesEndpoint extends BaseEndpoint<AccountIdentityListDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly account: string) {
        super(true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const request: HTTPRequest = {
            method: 'GET',
            url: `${this.rucioHost}/accounts/${encodeURIComponent(this.account)}/identities`,
            headers: { 'X-Rucio-Auth-Token': this.rucioAuthToken, Accept: 'application/x-json-stream' },
            body: null,
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(): Promise<AccountIdentityListDTO | undefined> {
        return undefined; // handled by handleCommonGatewayEndpointErrors
    }

    createDTO(data: string): AccountIdentityListDTO {
        const identities = parseNDJSON<TRucioAccountIdentity>(data).map(i => ({
            identity: i.identity,
            type: convertToIdentityType(i.type),
            email: i.email,
        }));
        return { status: 'success', account: this.account, identities };
    }
}
