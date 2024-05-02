import { ListTransferStatisticsDTO, TransferStatisticsDTO } from "@/lib/core/dto/transfer-dto";
import { BaseStreamableEndpoint } from "@/lib/sdk/gateway-endpoints";
import { HTTPRequest } from "@/lib/sdk/http";
import { Response } from "node-fetch";
import { convertToTransferStatistics, TRucioTransferStatistics } from "../transfer-gateway-utils";

export default class ListTransferStatsEndpoint extends BaseStreamableEndpoint<ListTransferStatisticsDTO, TransferStatisticsDTO> {
    constructor(
        private readonly rucioAuthToken: string
    ){
        super(true)
    }

    async initialize(): Promise<void> {
        await super.initialize()
        const rucioHost = await this.envConfigGateway.rucioHost()
        const endpoint = `${rucioHost}/requests/metrics`
        const request: HTTPRequest = {
            method: 'GET',
            url: endpoint,
            headers: {
                'X-Rucio-Auth-Token': this.rucioAuthToken,
                'Content-Type': 'application/x-json-stream',
            },
            body: null,
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
    async reportErrors(statusCode: number, response: Response): Promise<ListTransferStatisticsDTO | undefined> {
        const data = await response.json()
        const errorDTO: ListTransferStatisticsDTO = {
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
     * Converts stream elements into TransferStatisticsDTO objects
     * @param response The individual TransferStatistics object streamed from Rucio
     * @returns The TransferStatisticsDTO object
     */
    createDTO(response: Buffer): TransferStatisticsDTO {
        const data: TRucioTransferStatistics = JSON.parse(JSON.parse(response.toString()))
        const dto: TransferStatisticsDTO = convertToTransferStatistics(data)
        return dto
    }
}