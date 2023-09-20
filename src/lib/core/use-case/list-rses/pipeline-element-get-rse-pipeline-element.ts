import { BaseStreamingPostProcessingPipelineElement } from "@/lib/sdk/postprocessing-pipeline-elements";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";

import { RSEDTO, getEmptyRSEDTO } from "@/lib/core/dto/rse-dto";
import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";
import { ListRSEsError, ListRSEsRequest, ListRSEsResponse } from "@/lib/core/usecase-models/list-rses-usecase-models";


export default class GetRSEPipelineElement extends BaseStreamingPostProcessingPipelineElement<ListRSEsRequest, ListRSEsResponse, ListRSEsError, RSEDTO>{
    constructor(private gateway: RSEGatewayOutputPort) {
        super();
    }
    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListRSEsRequest>, responseModel: ListRSEsResponse): Promise<RSEDTO> {
        try {
            const { rucioAuthToken } = requestModel;
            const rseName = responseModel.name;
            if(!rseName) {
                const errorDTO: RSEDTO = getEmptyRSEDTO();
                errorDTO.status = 'error';
                errorDTO.errorCode = 400;
                errorDTO.errorName = 'Invalid Request';
                errorDTO.errorMessage = 'RSE Name not found in response model';
                return errorDTO;
            }
            const dto: RSEDTO = await this.gateway.getRSE(rucioAuthToken, rseName);
            return dto;
        } catch (error: any) {
            const errorDTO: RSEDTO = getEmptyRSEDTO();
            errorDTO.status = 'error';
            errorDTO.errorCode = 500;
            errorDTO.errorName = 'Gateway Error';
            errorDTO.errorMessage = (error as Error).message;
            return errorDTO;
        }
    }

    handleGatewayError(dto: RSEDTO): ListRSEsError {
        const errorModel: ListRSEsError = {
            status: 'error',
            name: dto.name,
            code: dto.errorCode? dto.errorCode : 400,
            message: dto.errorName + ': ' + dto.errorMessage 
        }
        return errorModel;
    }
   
    transformResponseModel(responseModel: ListRSEsResponse, dto: RSEDTO): ListRSEsResponse {
        responseModel.id = dto.id;
        responseModel.deterministic = dto.deterministic;
        responseModel.rse_type = dto.rse_type;
        responseModel.staging_area = dto.staging_area;
        responseModel.volatile = dto.volatile;
        return responseModel;
    }
}