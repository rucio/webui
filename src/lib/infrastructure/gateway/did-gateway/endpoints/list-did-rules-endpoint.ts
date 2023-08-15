import { DIDRulesDTO, ListDIDRulesDTO } from "@/lib/core/dto/did-dto";
import { BaseStreamableEndpoint, extractErrorMessage } from "@/lib/sdk/gateway-endpoints";
import { HTTPRequest } from "@/lib/sdk/http";
import { Response } from "node-fetch";
import { convertToDIDRulesDTO, TRucioRules } from "../did-gateway-utils";

export default class ListDIDRulesEndpoint extends BaseStreamableEndpoint<ListDIDRulesDTO, DIDRulesDTO >{
    constructor(
        private readonly rucioAuthToken: string,
        private readonly scope: string,
        private readonly name: string,
    ){
        super(true)
    }

    /**
     * @override
     */
    async initialize(): Promise<void> {
        await super.initialize()
        const rucioHost = await this.envConfigGateway.rucioHost()
        const endpoint = `${rucioHost}/dids/${this.scope}/${this.name}/rules`
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: null,
            params: undefined
        }
        this.request = request
        this.initialized = true
    }

    async reportErrors(statusCode: number, response: Response): Promise<ListDIDRulesDTO | undefined> {
        if(statusCode === 200) {
            return Promise.resolve(undefined)
        }

        let errorDetails = await extractErrorMessage(response)
        
        const errorDTO: ListDIDRulesDTO = {
            status: 'error',
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway_endpoint_error',
            errorMessage: `${errorDetails?? 'No error details available from rucio'}`,

        }
        return Promise.resolve(errorDTO)
    }

    createDTO(response: Buffer): DIDRulesDTO {
        const data: TRucioRules = JSON.parse(JSON.parse(response.toString()))
        const dto: DIDRulesDTO = convertToDIDRulesDTO(data)
        return dto
    }
}