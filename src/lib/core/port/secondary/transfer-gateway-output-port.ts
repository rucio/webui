import { ListTransfersDTO, ListTransferStatisticsDTO } from "../../dto/transfer-dto";

export default interface TransferGatewayOutputPort {

    /**
     * Gets the list of all transfer statistics
     * @param rucioAuthToken A valid Rucio Auth Token.
     */
    listTransferStatistics(rucioAuthToken: string): Promise<ListTransferStatisticsDTO>

    /**
     * Lists all active transfers over a given source-destination RSE pair
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param sourceRse The source RSE.
     * @param destRse The destination RSE.
     */
    listTransfers(rucioAuthToken: string, sourceRse: string, destRse: string): Promise<ListTransfersDTO>
}