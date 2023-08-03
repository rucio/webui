import { ListRSEsDTO, RSEDTO } from "@/lib/core/dto/rse-dto";
import { BaseStreamableEndpoint } from "@/lib/sdk/gateway-endpoints";
import { HTTPRequest } from "@/lib/sdk/http";
import { Response } from "node-fetch";
import { convertToRSEDTO, TRucioRSE } from "../rse-gateway-utils";

export default class ListRSEsEndpoint extends BaseStreamableEndpoint<ListRSEsDTO, RSEDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly rseExpression: string,
    ){
        super(true)
    }

    async initialize(): Promise<void> {
        await super.initialize()
        const rucioHost = await this.envConfigGateway.rucioHost()
        const endpoint = `${rucioHost}/rses`
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: null,
            params: {
                expression: this.rseExpression
            }
        }
        this.request = request
        this.initialized = true
    }

    /**
     * If this method is called, it means that the response from Rucio was not or any of the error types in ${@link handleCommonGatewayEndpointErrors}
     * @param statusCode The status code returned from Rucio
     * @param response The reponse containing error data
     * @returns 
     */
    async reportErrors(statusCode: number, response: Response): Promise<ListRSEsDTO | undefined> {
        const data = await response.json()
        const errorDTO: ListRSEsDTO = {
            status: 'error',
            errorMessage: data,
            errorCode: statusCode,
            errorName: 'Unknown Error',
            errorType: 'gateway-endpoint-error',
            stream: null,
        }
        return Promise.resolve(errorDTO)

    }

    /**
     * Converts stream elements into RSEDTO objects
     * @param response The individual RSE object streamed from Rucio
     * @returns The RSEDTO object
     */
    createDTO(response: Buffer): RSEDTO {
        const data: TRucioRSE = JSON.parse(response.toString())
        const dto: RSEDTO = convertToRSEDTO(data)
        return dto
    }
    
}