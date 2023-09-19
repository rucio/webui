import { RSEAttributeDTO } from "@/lib/core/dto/rse-dto";
import { BaseEndpoint } from "@/lib/sdk/gateway-endpoints";
import { HTTPRequest } from "@/lib/sdk/http";
import { Response } from "node-fetch";

export default class GetRSEAttributesEndpoint extends BaseEndpoint<RSEAttributeDTO> {
    constructor(
        private rucioAuthToken: string,
        private rseName: string,
    ) {
        super();
    }

    async initialize(): Promise<void> {
        await super.initialize();
        this.url = `${this.rucioHost}/rses/${this.rseName}/attr`;
        const request: HTTPRequest = {
            method: 'GET',
            url: this.url,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: null,
            params: undefined
        }
        this.request = request;
        this.initialized = true;
    }
    
    async reportErrors(statusCode: number, response: Response): Promise<RSEAttributeDTO | undefined> {
        const errorMessage = await response.json()
        const error = {
            status: 'error',
            errorCode: statusCode,
            errorMessage: errorMessage,
            errorName: 'Rucio Server Error',
            errorType: 'gateway_endpoint_error',
        }
        return error as RSEAttributeDTO
    }

    createDTO(data: Object): RSEAttributeDTO {
        return {
            status: 'success',
            ...data
        } as RSEAttributeDTO
    }

}