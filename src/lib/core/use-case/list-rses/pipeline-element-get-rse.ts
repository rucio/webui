import { BaseStreamingPostProcessingPipelineElement } from "@/lib/sdk/postprocessing-pipeline-elements";
import { ListRSEsError, ListRSEsRequest, ListRSEsResponse } from "../../usecase-models/list-rse-usecase-models";
import { RSEDTO } from "../../dto/rse-dto";
import RSEGatewayOutputPort from "../../port/secondary/rse-gateway-output-port";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { RSEType } from "../../entity/rucio";
import { ListDIDsError } from "../../usecase-models/list-dids-usecase-models";

export default class GetRSEsPipelineElement extends BaseStreamingPostProcessingPipelineElement<ListRSEsRequest, ListRSEsResponse, ListRSEsError, RSEDTO> {
    constructor( private rseGateway: RSEGatewayOutputPort) {
        super();
    }
    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListRSEsRequest>, responseModel: ListRSEsResponse): Promise<RSEDTO> {
        try {
            const dto: RSEDTO = await this.rseGateway.getRSE(requestModel.rucioAuthToken, responseModel.name);
            return dto;
        } catch (error: any) {
            const errorDTO: RSEDTO = {
                status: 'error',
                errorName: 'Unknown Error',
                errorMessage: (error as Error).message,
                id: '',
                name: '',
                rse_type: RSEType.UNKNOWN,
                volatile: false,
                deterministic: false,
                staging_area: false,

            }
            return errorDTO;
        }
    }

    handleGatewayError(dto: RSEDTO): ListRSEsError {
        let error: 'Unknown Error' | 'RSE not found' | 'Invalid Request' = 'Unknown Error';
        switch(dto.errorMessage) {
            case "Invalid Auth Token":
                error = 'Invalid Request';
                break;
            case "RSE not found":
                error = 'RSE not found';
                break;
            default:
                error = 'Unknown Error';
                break;
        }

        const errorModel: ListRSEsError= {
            status: 'error',
            name: dto.name,
            error: error,
            code: dto.errorCode ?? 400,
            message: `${dto.errorCode}: ${dto.errorMessage} for RSE ${dto.name}`,
        }
        return errorModel
    }

    transformResponseModel(responseModel: ListRSEsResponse, dto: RSEDTO): ListRSEsResponse {
        responseModel.id = dto.id;
        responseModel.rse_type = dto.rse_type;
        responseModel.volatile = dto.volatile;
        responseModel.deterministic = dto.deterministic;
        responseModel.staging_area = dto.staging_area;
        return responseModel;
    }
}