import { RequestDTO } from '../../dto/request-dto';

// RequestGatewayOutputPort interface defines the contract for a gateway that retrieves requests from RUCIO.
export default interface RequestGatewayOutputPort {
    /**
     * Retrieves a request by its RUCIO Auth Token, scope, name, and RSE.
     * @param rucioAuthToken - The authentication token for RUCIO.
     * @param scope - The scope of the request.
     * @param name - The name of the request.
     * @param rse - The RSE (RUCIO Storage Element) associated with the request.
     * @returns A Promise that resolves to a RequestDTO containing the request details.
     */
    getRequest(rucioAuthToken: string, scope: string, name: string, rse: string): Promise<RequestDTO>;
}
