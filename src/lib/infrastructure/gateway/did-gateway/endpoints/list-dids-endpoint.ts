import { BaseStreamableEndpoint } from "@/lib/sdk/gateway-endpoints"
import { BaseHttpErrorTypes } from "@/lib/sdk/http"
import { HTTPRequest } from "@/lib/common/http"
import { ListDIDDTO } from "@/lib/core/dto/did-dto"
import { DID, DIDType } from "@/lib/core/entity/rucio"
import { Response } from "node-fetch"


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
     */
    constructor(
        private rucioAuthToken: string,
        private scope: string,
        private name: string,
        private type: DIDType,
    ) {
        super(true)
    }

    /** @override */
    async initialize(): Promise<void> {
        await super.initialize()
        const rucioHost = await this.envConfigGateway.rucioHost()
        const endpoint = `${rucioHost}/dids/${this.scope}/dids/search`
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
        }
        this.request = request
        this.initialized = true
    }

    /** @implements */
    reportErrors(response: Response): Promise<ListDIDDTO | undefined> {
        const statusCode = response.status
        
        if(statusCode === 200) {
            return Promise.resolve(undefined)
        }

        const dto: ListDIDDTO = {
            status: 'error',
            error: BaseHttpErrorTypes.UNKNOWN_ERROR,
            stream: null,
        }
        switch (statusCode) {
            case 409:
                dto.error = {
                    errorCode: 409,
                    errorMessage: 'Wrong DID type',
                }
                break
            default:
                dto.error = BaseHttpErrorTypes.UNKNOWN_ERROR
                break
        }
        return Promise.resolve(dto)
    }

    /** @implements */
    createDTO(chunk: Buffer): DID {
        const didName = JSON.parse(chunk.toString()).split('"')[1]
        const did: DID = {
            name: didName,
            scope: this.scope,
            did_type: this.type,
        }
        return did
    }
}