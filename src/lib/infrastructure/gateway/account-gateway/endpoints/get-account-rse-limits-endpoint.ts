import { AccountRSELimitDTO as AccountRSELimitDTO } from '@/lib/core/dto/account-dto';
import { BaseEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';

export default class GetAccountRSELimits extends BaseEndpoint<AccountRSELimitDTO> {
    constructor(private rucioAuthToken: string, private account: string) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        this.url = `${this.rucioHost}/accounts/${this.account}/limits`;
        const request: HTTPRequest = {
            method: 'GET',
            url: this.url,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: null,
            params: undefined,
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number): Promise<AccountRSELimitDTO | undefined> {
        const dto: AccountRSELimitDTO = {
            status: 'error',
            errorCode: statusCode,
            errorType: 'gateway_endpoint_error',
            errorMessage: 'Unknown Error occurred while fetching data from Rucio Server',
            errorName: 'Unknown Error',
            account: this.account,
            limits: {},
        };
        return Promise.resolve(dto);
    }

    createDTO(data: Record<string, number>): AccountRSELimitDTO {
        for (const [key, value] of Object.entries(data)) {
            if (value === Infinity || value === -1 || value === null) {
                data[key] = Infinity;
            }
        }
        const dto: AccountRSELimitDTO = {
            account: this.account,
            limits: data,
            status: 'success',
        };
        return dto;
    }
}
