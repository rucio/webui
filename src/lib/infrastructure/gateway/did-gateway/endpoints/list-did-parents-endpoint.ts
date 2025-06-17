import { DIDDTO, ListDIDDTO } from '@/lib/core/dto/did-dto';
import { BaseStreamableEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { convertToDIDDTO, TRucioDID } from '../did-gateway-utils';

export default class ListDIDParentsEndpoint extends BaseStreamableEndpoint<ListDIDDTO, DIDDTO> {
    constructor(private readonly rucioAuthToken: string, private readonly scope: string, private readonly name: string) {
        super(true);
    }

    /**
     * @override
     */
    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const encodedScope = encodeURIComponent(this.scope);
        const encodedName = encodeURIComponent(this.name);
        const endpoint = `${rucioHost}/dids/${encodedScope}/${encodedName}/parents`;
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

    async reportErrors(statusCode: number): Promise<ListDIDDTO | undefined> {
        if (statusCode === 200) {
            return Promise.resolve(undefined);
        }
        const errorDTO: ListDIDDTO = {
            status: 'error',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `Error fetching parents for DID ${this.scope}:${this.name}`,
        };
        return Promise.resolve(errorDTO);
    }

    createDTO(response: Buffer): DIDDTO {
        const data: TRucioDID = JSON.parse(JSON.parse(response.toString()));
        const dto: DIDDTO = convertToDIDDTO(data);
        return dto;
    }
}
