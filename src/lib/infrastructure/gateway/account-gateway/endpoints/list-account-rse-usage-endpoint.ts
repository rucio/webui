import { AccountRSEUsageDTO, ListAccountRSEUsageDTO } from '@/lib/core/dto/account-dto';
import { BaseStreamableEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { Response } from 'node-fetch';
import { convertToAccountRSEUsageDTO } from '../account-gateway-utils';

/**
 * Retrieves RSE usage for an account
 */
export default class ListAccountRSEUsageEndpoint extends BaseStreamableEndpoint<ListAccountRSEUsageDTO, AccountRSEUsageDTO> {
    constructor(private rucioAuthToken: string, private account: string) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/accounts/${this.account}/usage`;
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
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

    async reportErrors(statusCode: number, response: Response): Promise<ListAccountRSEUsageDTO | undefined> {
        let errorMessage = 'Unknown Error occurred while fetching data from Rucio Server';
        try {
            errorMessage = await response.text();
        } catch (e) {
            // do nothing
        }

        const unknownErrorDTO: ListAccountRSEUsageDTO = {
            status: 'error',
            errorCode: statusCode,
            errorType: 'gateway_endpoint_error',
            errorMessage: errorMessage,
            errorName: 'Unknown Error',
        };
        return Promise.resolve(unknownErrorDTO);
    }

    createDTO(data: Buffer): AccountRSEUsageDTO {
        const usage = JSON.parse(JSON.parse(data.toString()));
        const dto: AccountRSEUsageDTO = convertToAccountRSEUsageDTO(usage, this.account);
        return dto;
    }
}
