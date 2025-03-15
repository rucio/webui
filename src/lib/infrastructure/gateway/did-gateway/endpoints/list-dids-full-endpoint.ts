import { BaseStreamableEndpoint } from '@/lib/sdk/gateway-endpoints';
import { HTTPRequest } from '@/lib/sdk/http';
import { ListDIDDTO } from '@/lib/core/dto/did-dto';
import { DID, DIDType } from '@/lib/core/entity/rucio';
import { Response } from 'node-fetch';

/**
 * A class that extends the `BaseStreamableEndpoint` class and provides an implementation for a streamable API endpoint 
 * that lists fully populated data identifiers (DIDs) from a Rucio server using the new endpoint.
 */
export default class ListDIDsFullEndpoint extends BaseStreamableEndpoint<ListDIDDTO, DID> {
    /**
     * Creates a new instance of the `ListDIDsFullEndpoint` class.
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
        // Use the new endpoint that returns fully populated DIDs
        const endpoint = `${rucioHost}/dids/${this.scope}/dids/list`;
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: null,
            params: {
                name: this.name,
                type: this.type.toLocaleLowerCase(),
            },
        };
        this.request = request;
        this.initialized = true;
    }

    /** @implements */
    async reportErrors(statusCode: number, response: Response): Promise<ListDIDDTO | undefined> {
        if (statusCode === 200) {
            return Promise.resolve(undefined);
        }

        let errorMessage = 'Unknown Error';
        try {
            const errorBody = await response.text();
            errorMessage = errorBody;
        } catch (error) {
            errorMessage = 'Failed to parse error response';
        }

        const errorDTO: ListDIDDTO = {
            status: 'error',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: errorMessage,
        };
        return Promise.resolve(errorDTO);
    }

    /** @implements */
    createDTO(chunk: Buffer): DID {
        try {
            // The new endpoint returns fully populated DIDs in NDJSON format
            const didData = JSON.parse(chunk.toString());
            
            // Create a DID object from the response
            const did: DID = {
                name: didData.name,
                scope: didData.scope,
                did_type: this.mapDIDType(didData.type),
                // Include additional properties that are now available directly from the endpoint
                bytes: didData.bytes || 0,
                length: didData.length || 0,
                open: didData.open || false,
                account: didData.account,
                monotonic: didData.monotonic || false,
                expired_at: didData.expired_at,
                status: 'success',
            };
            
            return did;
        } catch (error) {
            console.error('Error parsing DID data:', error);
            // Return a default DID with error status
            return {
                name: '',
                scope: '',
                did_type: DIDType.UNKNOWN,
                status: 'error',
                errorMessage: 'Failed to parse DID data',
            };
        }
    }

    /**
     * Maps the DID type string from the Rucio server to the DIDType enum.
     * @param type The DID type string from the Rucio server.
     * @returns The corresponding DIDType enum value.
     */
    private mapDIDType(type: string): DIDType {
        switch (type.toLowerCase()) {
            case 'dataset':
                return DIDType.DATASET;
            case 'container':
                return DIDType.CONTAINER;
            case 'collection':
                return DIDType.COLLECTION;
            case 'file':
                return DIDType.FILE;
            case 'derived':
                return DIDType.DERIVED;
            default:
                return DIDType.UNKNOWN;
        }
    }
} 