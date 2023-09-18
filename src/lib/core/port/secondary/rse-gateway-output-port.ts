import { ListRSEsDTO, RSEDTO } from "../../dto/rse-dto";

export default interface RSEGatewayOutputPort {

    /**
     * Gets the details of the given RSE.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param rseName The RSE to get.
     */
    getRSE(rucioAuthToken: string, rseName: string): Promise<RSEDTO>

    /**
     * Lists all supported protocols for a given RSE.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param rseName The RSE to list protocols for.
     */
    getRSEProtocols(rucioAuthToken: string, rseName: string): Promise<ListRSEsDTO>

    /**
     * Get all supported attributes for a given RSE.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param rseName The RSE to list attributes for.
     */
    getRSEAttributes(rucioAuthToken: string, rseName: string): Promise<ListRSEsDTO>

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