import { ListRSEsDTO } from "@/lib/core/dto/rse-dto";
import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";
import { injectable } from "inversify";
import ListRSEsEndpoint from "./endpoints/list-rses-endpoint";

@injectable()
export default class RSEGateway implements RSEGatewayOutputPort {
    async listRSEs(rucioAuthToken: string, rseExpression: string): Promise<ListRSEsDTO> {
            const endpoint: ListRSEsEndpoint = new ListRSEsEndpoint(rucioAuthToken, rseExpression)
            const errorDTO = await endpoint.fetch()
            if(!errorDTO) {
                const listRSEsDTO: ListRSEsDTO = {
                    status: 'success',
                    stream: endpoint
                }
                return listRSEsDTO
            }
            return Promise.resolve(errorDTO)
    }
}