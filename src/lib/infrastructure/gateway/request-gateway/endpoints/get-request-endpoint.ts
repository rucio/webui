import { RequestDTO } from '@/lib/core/dto/request-dto';
import { BaseEndpoint, extractErrorMessage } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { Response } from 'node-fetch';

export default class GetRequestEndpoint extends BaseEndpoint<RequestDTO> {
    constructor(private rucioAuthToken: string, private scope: string, private name: string, private rse: string) {
        super();
    }
    /**
     * @override
     */
    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/requests/${encodeURIComponent(this.scope)}/${encodeURIComponent(this.name)}/${encodeURIComponent(this.rse)}`;
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

    async reportErrors(statusCode: number, response: Response): Promise<RequestDTO | undefined> {
        if (statusCode === 200) {
            return Promise.resolve(undefined);
        }

        const errorDetails = await extractErrorMessage(response);

        const errorDTO: RequestDTO = {
            status: 'error',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${errorDetails ?? 'No error details available from rucio'}`,
        };
        return Promise.resolve(errorDTO);
    }

    createDTO(response: object): RequestDTO {
        return {
            status: 'success',
            data: response as RequestDTO['data'],
        };
    }
}
