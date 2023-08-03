import { ListRSEsDTO } from "@/lib/core/dto/rse-dto";
import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";
import { injectable } from "inversify";
import ListRSEsEndpoint from "./endpoints/list-rses-endpoint";

@injectable()
export default class RSEGateway implements RSEGatewayOutputPort {
    async listRSEs(rucioAuthToken: string, rseExpression: string): Promise<ListRSEsDTO> {
        try {
            const endpoint: ListRSEsEndpoint = new ListRSEsEndpoint(rucioAuthToken, rseExpression)
            await endpoint.fetch()
            const dto: ListRSEsDTO = {
                status: 'success',
                stream: endpoint
            }
            return Promise.resolve(dto)
        } catch(error) {
            const errorDTO: ListRSEsDTO = {
                status: 'error',
                errorName: 'Exception occurred while fetching RSEs',
                errorType: 'gateway_endpoint_error',
                errorMessage: error?.toString(),
            }
            return Promise.resolve(errorDTO)
        }
    }
}