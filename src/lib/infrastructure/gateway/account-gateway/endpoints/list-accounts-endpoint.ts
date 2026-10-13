import { AccountListItemDTO, ListAccountsDTO } from '@/lib/core/dto/account-dto';
import { AccountListFilter } from '@/lib/core/entity/account';
import { BaseStreamableEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { convertToAccountListItemDTO, parseStreamedLine, TRucioAccountListItem } from '../account-gateway-utils';

/**
 * Streams the active accounts (GET /accounts/). Only the filter keys that are set are sent.
 */
export default class ListAccountsEndpoint extends BaseStreamableEndpoint<ListAccountsDTO, AccountListItemDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly listFilter: AccountListFilter) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const params: { [key: string]: string } = {};
        if (this.listFilter.account) params['account'] = this.listFilter.account;
        if (this.listFilter.accountType) params['account_type'] = this.listFilter.accountType;
        if (this.listFilter.identity) params['identity'] = this.listFilter.identity;

        const request: HTTPRequest = {
            method: 'GET',
            url: `${this.rucioHost}/accounts/`,
            params: Object.keys(params).length > 0 ? params : undefined,
            headers: { 'X-Rucio-Auth-Token': this.rucioAuthToken, Accept: 'application/x-json-stream' },
            body: null,
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(): Promise<ListAccountsDTO | undefined> {
        return undefined; // handled by handleCommonGatewayEndpointErrors
    }

    createDTO(data: Buffer): AccountListItemDTO {
        return convertToAccountListItemDTO(parseStreamedLine<TRucioAccountListItem>(data));
    }
}
