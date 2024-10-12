import { ListRSEsDTO, RSEAttributeDTO, RSEDetailsDTO, RSEProtocolDTO, RSEUsageDTO } from '@/lib/core/dto/rse-dto';

export default interface RSEGatewayOutputPort {
    /**
     * Gets the details of the given RSE.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param rseName The RSE to get.
     */
    getRSE(rucioAuthToken: string, rseName: string): Promise<RSEDetailsDTO>;

    /**
     * Lists all supported protocols for a given RSE.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param rseName The RSE to list protocols for.
     */
    getRSEProtocols(rucioAuthToken: string, rseName: string): Promise<RSEProtocolDTO>;

    /**
     * Get all supported attributes for a given RSE.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param rseName The RSE to list attributes for.
     */
    getRSEAttributes(rucioAuthToken: string, rseName: string): Promise<RSEAttributeDTO>;

    /**
     * Streams the RSEs for the given RSE Expression.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param rseExpression The RSE Expression to list RSEs for.
     */
    listRSEs(rucioAuthToken: string, rseExpression: string): Promise<ListRSEsDTO>;

    /**
     * Get current usage for a given RSE.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param rseName The RSE to list usage for.
     */
    getRSEUsage(rucioAuthToken: string, rseName: string): Promise<RSEUsageDTO>;
}
