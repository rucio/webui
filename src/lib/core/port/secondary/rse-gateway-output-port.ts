import { ListRSEsDTO, RSEDTO } from "../../dto/rse-dto";

export default interface RSEGatewayOutputPort {
    /**
     * Streams the RSEs for the given RSE Expression.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param rseExpression The RSE Expression to list RSEs for.
     */
    listRSEs(rucioAuthToken: string, rseExpression: string): Promise<ListRSEsDTO>

    /**
     * Gets the RSE for the given RSE name.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param rseName The RSE name to get.
     */
    getRSE(rucioAuthToken: string, rseName: string): Promise<RSEDTO>
}