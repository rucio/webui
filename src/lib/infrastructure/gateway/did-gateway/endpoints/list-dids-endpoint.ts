import { BaseStreamableEndpoint } from '@/lib/sdk/gateway-endpoints';
import { BaseHttpErrorTypes } from '@/lib/sdk/http';
import { HTTPRequest } from '@/lib/sdk/http';
import { ListDIDDTO } from '@/lib/core/dto/did-dto';
import { DID, DIDType, MetaFilter } from '@/lib/core/entity/rucio';
import { Response } from 'node-fetch';

/**
 * A class that extends the `BaseStreamableEndpoint` class and provides an implementation for a streamable API endpoint that lists data identifiers (DIDs) from a Rucio server.
 */
export default class ListDIDsEndpoint extends BaseStreamableEndpoint<ListDIDDTO, DID> {
    /**
     * Creates a new instance of the `ListDIDsEndpoint` class.
     * @param rucioAuthToken A string that represents the authentication token to be used for the API request.
     * @param scope A string that represents the scope of the DIDs to be listed.
     * @param name A string that represents the name of the DIDs to be listed.
     * @param type A `DIDType` value that represents the type of the DIDs to be listed.
     * @param filters A list of user-defined filters
     */
    constructor(private rucioAuthToken: string, private scope: string, private name: string, private type: DIDType, private filters: MetaFilter[] = []) {
        super(true);
    }

    /** @override */
    async initialize(): Promise<void> {
        await super.initialize();
        const rucioHost = await this.envConfigGateway.rucioHost();
        const endpoint = `${rucioHost}/dids/${this.scope}/dids/search`;


        const queryString = [
            `name=${encodeURIComponent(this.name)}`,
            `type=${encodeURIComponent(this.type.toLowerCase())}`,
            ...this.filters.map(f => 
                `${encodeURIComponent(f.key)}${f.operator}${encodeURIComponent(String(f.value ?? ''))}`
            )
            ].join('&');
        
        const request: HTTPRequest = {
            method: "GET",
            url: `${endpoint}?${queryString}`,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            }
            };
        
        this.request = request;
        this.initialized = true;
    }
    
    private formatFilters(filters: MetaFilter[]): Record<string, string> {
        const result: Record<string, string> = {};
        
        filters.forEach(filter => {
            result[filter.key] = filter.operator + filter.value;
        });
        
        return result;
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
    createDTO(chunk: Buffer): DID {
        const didName = JSON.parse(chunk.toString()).split('"')[1];
        const did: DID = {
            name: didName,
            scope: this.scope,
            did_type: this.type,
        };
        return did;
    }
}
