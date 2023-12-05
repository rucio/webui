import { CreateDIDSampleDTO } from "@/lib/core/dto/did-dto";
import { BaseEndpoint } from "@/lib/sdk/gateway-endpoints";
import { HTTPRequest } from "@/lib/sdk/http";
import { Response } from "node-fetch";

export default class CreateDidSampleEndpoint extends BaseEndpoint<CreateDIDSampleDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly input_scope: string,
        private readonly input_name: string,
        private readonly output_scope: string,
        private readonly output_name: string,
        private readonly nbfiles: number,
    ){
        // parse body as text
        super(true)
    }

    async initialize(): Promise<void> {
        await super.initialize()
        const rucioHost = await this.envConfigGateway.rucioHost()
        const endpoint = `${rucioHost}/dids/sample`
        const request: HTTPRequest = {
            method: 'POST',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/json',
            },
            body: {
                input_scope: this.input_scope,
                input_name: this.input_name,
                output_scope: this.output_scope,
                output_name: this.output_name,
                nbfiles: this.nbfiles,
            },
        }
        this.request = request
        this.initialized = true
    }

    async reportErrors(statusCode: number, response: Response): Promise<CreateDIDSampleDTO | undefined> {
        const data = await response.json()
        const errorDTO: CreateDIDSampleDTO = {
            status: 'error',
            created: false,
            errorMessage: data,
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway-endpoint-error',
        }
        return Promise.resolve(errorDTO)
    }

    createDTO(data: string): CreateDIDSampleDTO {
        const dto: CreateDIDSampleDTO = {
            status: 'success',
            created: data.toLowerCase() === "created" ? true : false,
        }
        return dto
    }
}