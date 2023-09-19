import { ListRSEsDTO, RSEAttributeDTO, RSEDTO, RSEProtocolDTO } from "@/lib/core/dto/rse-dto";
import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";
import { injectable } from "inversify";
import ListRSEsEndpoint from "./endpoints/list-rses-endpoint";
import GetRSEEndpoint from "./endpoints/get-rse-endpoint";
import GetRSEAttributesEndpoint from "./endpoints/get-rse-attributes";

@injectable()
export default class RSEGateway implements RSEGatewayOutputPort {
    async getRSE(rucioAuthToken: string, rseName: string): Promise<RSEDTO> {
        const endpoint = new GetRSEEndpoint(rucioAuthToken, rseName)
        const dto = await endpoint.fetch()
        return dto
    }

    getRSEProtocols(rucioAuthToken: string, rseName: string): Promise<RSEProtocolDTO> {
        throw new Error("Method not implemented.");
    }

    async getRSEAttributes(rucioAuthToken: string, rseName: string): Promise<RSEAttributeDTO> {
        const endpoint = new GetRSEAttributesEndpoint(rucioAuthToken, rseName)
        const dto = await endpoint.fetch()
        return dto
    }
    
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