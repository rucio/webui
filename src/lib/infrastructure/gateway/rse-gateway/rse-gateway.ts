import {ListRSEsDTO, RSEAttributeDTO, RSEDTO, RSEProtocolDTO, RSEUsageDTO} from "@/lib/core/dto/rse-dto";
import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";
import { injectable } from "inversify";
import ListRSEsEndpoint from "./endpoints/list-rses-endpoint";
import GetRSEEndpoint from "./endpoints/get-rse-endpoint";
import GetRSEAttributesEndpoint from "./endpoints/get-rse-attributes-endpoint";
import GetRSEProtocolsEndpoint from "./endpoints/get-rse-protocols-endpoint";
import GetRSEUsageEndpoint from "@/lib/infrastructure/gateway/rse-gateway/endpoints/get-rse-usage-endpoint";

@injectable()
export default class RSEGateway implements RSEGatewayOutputPort {
    async getRSE(rucioAuthToken: string, rseName: string): Promise<RSEDTO> {
        const endpoint = new GetRSEEndpoint(rucioAuthToken, rseName)
        const dto = await endpoint.fetch()
        return dto
    }

    getRSEProtocols(rucioAuthToken: string, rseName: string): Promise<RSEProtocolDTO> {
        const endpoint = new GetRSEProtocolsEndpoint(rucioAuthToken, rseName)
        const dto = endpoint.fetch()
        return dto
    }

    async getRSEAttributes(rucioAuthToken: string, rseName: string): Promise<RSEAttributeDTO> {
        const endpoint = new GetRSEAttributesEndpoint(rucioAuthToken, rseName)
        const dto = await endpoint.fetch()
        return dto
    }

    async listRSEs(rucioAuthToken: string, rseExpression: string): Promise<ListRSEsDTO> {
        const endpoint: ListRSEsEndpoint = new ListRSEsEndpoint(rucioAuthToken, rseExpression);
        const errorDTO = await endpoint.fetch();
        if (!errorDTO) {
            const listRSEsDTO: ListRSEsDTO = {
                status: 'success',
                stream: endpoint,
            };
            return listRSEsDTO;
        }
        if (errorDTO.errorCode === 400 && !errorDTO.errorMessage?.includes('syntax')) {
            errorDTO.errorCode = 404;
            console.log('RSEGateway: The error message indicates empty response for a valid expression. Setting status code from 400 to 404.');
        }
        return Promise.resolve(errorDTO);
    }

    async getRSEUsage(rucioAuthToken: string, rseName: string): Promise<RSEUsageDTO> {
        const endpoint = new GetRSEUsageEndpoint(rucioAuthToken, rseName)
        const dto = await endpoint.fetch()
        return dto
    }

}