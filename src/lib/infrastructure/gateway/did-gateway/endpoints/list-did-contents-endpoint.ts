import { DIDDTO, ListDIDDTO } from '@/lib/core/dto/did-dto';
import { BaseStreamableEndpoint, extractErrorMessage } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { Response } from 'node-fetch';
import { convertToDIDDTO, TRucioDID } from '../did-gateway-utils';

export default class ListDIDContentsEndpoint extends BaseStreamableEndpoint<ListDIDDTO, DIDDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly scope: string, private readonly name: string) {
        super(true);
    }
    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/dids/${encodeURIComponent(this.scope)}/${encodeURIComponent(this.name)}/dids`;
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: null,
            params: undefined,
        };
        this.request = request;
        this.initialized = true;
    }

    async reportErrors(statusCode: number, response: Response): Promise<ListDIDDTO | undefined> {
        if (statusCode === 200) {
            return Promise.resolve(undefined);
        }

        const errorDetails = await extractErrorMessage(response);

        const errorDTO: ListDIDDTO = {
            status: 'error',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${errorDetails ?? 'No error details available from rucio'}`,
        };
        return Promise.resolve(errorDTO);
    }

    createDTO(response: Buffer): DIDDTO {
        const data: TRucioDID = JSON.parse(JSON.parse(response.toString()));
        const dto: DIDDTO = convertToDIDDTO(data);
        return dto;
    }
}
