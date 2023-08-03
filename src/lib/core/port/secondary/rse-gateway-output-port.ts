import { ListRSEsDTO } from "../../dto/rse-dto";

export default interface RSEGatewayOutputPort {
    /**
     * Streams the RSEs for the given RSE Expression.
     * @param rucioAuthToken A valid Rucio Auth Token.
     * @param rseExpression The RSE Expression to list RSEs for.
     */
    listRSEs(rucioAuthToken: string, rseExpression: string): Promise<ListRSEsDTO>
}