import { ListTransfersDTO, TransferDTO } from "@/lib/core/dto/transfer-dto";
import { BaseStreamableEndpoint } from "@/lib/sdk/gateway-endpoints";
import { HTTPRequest } from "@/lib/sdk/http";
import { Response } from "node-fetch";
import { convertToTransfer, TRucioTransfer } from "../transfer-gateway-utils";

export default class ListTransfersEndpoint extends BaseStreamableEndpoint<ListTransfersDTO, TransferDTO> {
    constructor(
        private readonly rucioAuthToken: string,
        private readonly sourceRSE: string,
        private readonly destRSE: string,
    ){
        super(true)
    }

    async initialize(): Promise<void> {
        await super.initialize()
        const rucioHost = await this.envConfigGateway.rucioHost()
        const endpoint = `${rucioHost}/requests/list`
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream'
            },
            body: null,
            params: {
                src_rse: this.sourceRSE,
                dest_rse: this.destRSE,
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
    async reportErrors(statusCode: number, response: Response): Promise<ListTransfersDTO | undefined> {
        const data = await response.json()
        const errorDTO: ListTransfersDTO = {
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
     * Convert stream elements into TransferDTO objects
     * @param response The individual Transfer object streamed from Rucio
     * @returns The TransferDTO object
     */
    createDTO(response: Buffer): TransferDTO {
        const data: TRucioTransfer = JSON.parse(JSON.parse(response.toString()))
        const dto: TransferDTO = convertToTransfer(data)
        return dto
    }
}