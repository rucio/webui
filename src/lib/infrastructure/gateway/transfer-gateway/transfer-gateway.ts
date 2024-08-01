import { ListTransferStatisticsDTO, ListTransfersDTO } from "@/lib/core/dto/transfer-dto";
import TransferGatewayOutputPort from "@/lib/core/port/secondary/transfer-gateway-output-port";
import { injectable } from "inversify";
import ListTransferStatsEndpoint from "./endpoints/list-transfer-stats-endpoint";
import ListTransfersEndpoint from "./endpoints/list-transfers-endpoint";

@injectable()
export default class TransferGateway implements TransferGatewayOutputPort {
    async listTransferStatistics(rucioAuthToken: string): Promise<ListTransferStatisticsDTO> {
        const endpoint: ListTransferStatsEndpoint = new ListTransferStatsEndpoint(rucioAuthToken)
        const errorDTO = await endpoint.fetch()
        if (!errorDTO) {
            const listTransferStatsDTO: ListTransferStatisticsDTO = {
                status: 'success',
                stream: endpoint
            }
            return listTransferStatsDTO
        }
        return Promise.resolve(errorDTO)
    }

    async listTransfers(rucioAuthToken: string, sourceRse: string, destRse: string): Promise<ListTransfersDTO> {
        const endpoint: ListTransfersEndpoint = new ListTransfersEndpoint(rucioAuthToken, sourceRse, destRse)
        const errorDTO = await endpoint.fetch()
        if (!errorDTO) {
            const listTransfersDTO: ListTransfersDTO = {
                status: 'success',
                stream: endpoint
            }
            return listTransfersDTO
        }
        return Promise.resolve(errorDTO)
    }
}