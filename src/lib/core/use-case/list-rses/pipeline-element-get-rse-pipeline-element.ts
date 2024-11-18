import { BaseStreamingPostProcessingPipelineElement } from '@/lib/sdk/postprocessing-pipeline-elements';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';

import { getEmptyRSEDetailsDTO, RSEDetailsDTO } from '@/lib/core/dto/rse-dto';
import RSEGatewayOutputPort from '@/lib/core/port/secondary/rse-gateway-output-port';
import { ListRSEsError, ListRSEsRequest, ListRSEsResponse } from '@/lib/core/usecase-models/list-rses-usecase-models';

export default class GetRSEPipelineElement extends BaseStreamingPostProcessingPipelineElement<
    ListRSEsRequest,
    ListRSEsResponse,
    ListRSEsError,
    RSEDetailsDTO
> {
    constructor(private gateway: RSEGatewayOutputPort) {
        super();
    }
    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListRSEsRequest>, responseModel: ListRSEsResponse): Promise<RSEDetailsDTO> {
        try {
            const { rucioAuthToken } = requestModel;
            const rseName = responseModel.name;
            if (!rseName) {
                const errorDTO: RSEDetailsDTO = getEmptyRSEDetailsDTO();
                errorDTO.status = 'error';
                errorDTO.errorCode = 400;
                errorDTO.errorName = 'Invalid Request';
                errorDTO.errorMessage = 'RSE Name not found in response model';
                return errorDTO;
            }
            const dto: RSEDetailsDTO = await this.gateway.getRSE(rucioAuthToken, rseName);
            return dto;
        } catch (error: any) {
            const errorDTO: RSEDetailsDTO = getEmptyRSEDetailsDTO();
            errorDTO.status = 'error';
            errorDTO.errorCode = 500;
            errorDTO.errorName = 'Gateway Error';
            errorDTO.errorMessage = (error as Error).message;
            return errorDTO;
        }
    }

    handleGatewayError(dto: RSEDetailsDTO): ListRSEsError {
        const errorModel: ListRSEsError = {
            status: 'error',
            name: dto.name,
            code: dto.errorCode ? dto.errorCode : 400,
            message: dto.errorName + ': ' + dto.errorMessage,
        };
        return errorModel;
    }

    transformResponseModel(responseModel: ListRSEsResponse, dto: RSEDetailsDTO): ListRSEsResponse {
        responseModel.id = dto.id;
        responseModel.deterministic = dto.deterministic;
        responseModel.rse_type = dto.rse_type;
        responseModel.staging_area = dto.staging_area;
        responseModel.volatile = dto.volatile;
        return responseModel;
    }
}
