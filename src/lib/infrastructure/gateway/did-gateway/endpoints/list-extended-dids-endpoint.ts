import { BaseStreamableEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { ListDIDDTO } from '@/lib/core/dto/did-dto';
import { DIDExtended, DIDLong, DIDType } from '@/lib/core/entity/rucio';
import { Response } from 'node-fetch';
import { convertToDIDExtended, TRucioExtendedDID } from '@/lib/infrastructure/gateway/did-gateway/did-gateway-utils';

/**
 * A class that extends the `BaseStreamableEndpoint` class and provides an implementation for a streamable API endpoint that lists data identifiers (DIDs) from a Rucio server.
 */
export default class ListExtendedDIDsEndpoint extends BaseStreamableEndpoint<ListDIDDTO, DIDExtended> {
    /**
     * Creates a new instance of the `ListDIDsEndpoint` class.
     * @param rucioAuthToken A string that represents the authentication token to be used for the API request.
     * @param scope A string that represents the scope of the DIDs to be listed.
     * @param name A string that represents the name of the DIDs to be listed.
     * @param type A `DIDType` value that represents the type of the DIDs to be listed.
     */
    constructor(private rucioAuthToken: string, private scope: string, private name: string, private type: DIDType) {
        super(true);
    }

    /** @override */
    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/dids/${this.scope}/dids/search`;
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: null,
            params: {
                dynamic_depth: DIDType.FILE,
                extended: 'true',
                name: this.name,
                type: this.type.toLocaleLowerCase(),
            },
        };
        this.request = request;
        this.initialized = true;
    }

    /** @implements */
    reportErrors(statusCode: number, response: Response): Promise<ListDIDDTO | undefined> {
        if (statusCode === 200) {
            return Promise.resolve(undefined);
        }

        const dto: ListDIDDTO = {
            status: 'error',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: 'Unknown Error',
            stream: null,
        };
        switch (statusCode) {
            case 409:
                dto.errorName = 'Invalid Parameters';
                dto.errorMessage = 'Wrong DID type';
                break;
            default:
                dto.errorMessage = 'Unknown Error';
                break;
        }
        return Promise.resolve(dto);
    }

    /** @implements */
    createDTO(response: Buffer): DIDExtended {
        const parsedResponse: TRucioExtendedDID = JSON.parse(JSON.parse(response.toString()));
        return convertToDIDExtended(parsedResponse);
    }
}
