import { BaseSingleEndpointPostProcessingPipelineStreamingUseCase } from "@/lib/sdk/usecase";
import { injectable } from "inversify";
import { ListRSEsError, ListRSEsRequest, ListRSEsResponse } from "../../usecase-models/list-rse-usecase-models";
import { ListRSEsDTO, RSEDTO } from "../../dto/rse-dto";
import { ListRSEsViewModel } from "@/lib/infrastructure/data/view-model/list-rse";
import { ListRSEsInputPort } from "../../port/primary/list-rse-ports";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import type { ListRSEsOutputPort } from "../../port/primary/list-rse-ports";
import type RSEGatewayOutputPort from "../../port/secondary/rse-gateway-output-port";
import GetRSEsPipelineElement from "./pipeline-element-get-rse";

@injectable()
class ListRSEsUseCase extends BaseSingleEndpointPostProcessingPipelineStreamingUseCase<ListRSEsRequest, ListRSEsResponse, ListRSEsError, ListRSEsDTO, RSEDTO, ListRSEsViewModel> implements ListRSEsInputPort {

    constructor(
        protected presenter: ListRSEsOutputPort,
        private rseGateway: RSEGatewayOutputPort,
    ) {
        const getRSEPipelineElement = new GetRSEsPipelineElement(rseGateway);
        super(presenter, [getRSEPipelineElement])
        this.rseGateway = rseGateway;
    }

    validateFinalResponseModel(responseModel: ListRSEsResponse): { isValid: boolean; errorModel?: ListRSEsError | undefined; } {
        if(
            responseModel.id === null || 
            responseModel.rse_type === null ||
            responseModel.volatile === null ||
            responseModel.deterministic === null ||
            responseModel.staging_area === null
        ) {
            return {
                isValid: false,
                errorModel: {
                    status: 'error',
                    name: responseModel.name,
                    error: 'Unknown Error',
                    code: 500,
                    message: 'RSE data is incomplete',
                }
            }
        }
        return { isValid: true }
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListRSEsRequest>): Promise<ListRSEsDTO> {
        return await this.rseGateway.listRSEs(requestModel.rucioAuthToken, requestModel.rseExpression);
    }

    handleGatewayError(error: ListRSEsDTO): ListRSEsError {
        let errorType = 'Unknown Error'
        let message = error.errorMessage
        if(message === 'Invalid Auth Token') {
            errorType = 'Invalid Request'
        }
        else if(message !== 'Unknown Error') {
            errorType = 'Invalid RSE Expression'
        }
        return {
            error: errorType,
            message: `${error.errorCode}: ${error.errorMessage}`,
        } as ListRSEsError
    }

    validateRequestModel(requestModel: AuthenticatedRequestModel<ListRSEsRequest>): ListRSEsError | undefined {
        // we dont validate the RSE Expression here, Rucio does that
        return undefined;
    }

    processStreamedData(dto: RSEDTO): { data: ListRSEsResponse | ListRSEsError; status: "error" | "success"; } {
        const errorModel: ListRSEsError = {
            status: 'error',
            code: 400,
            error: 'Invalid RSE Query',
            message: 'Gateway received an invalid (undefined) RSE for the query',
            name: 'Gateway Error: Undefined RSE in stream',
        }
        if(dto.name === undefined) {
            return {
                status: 'error',
                data: errorModel,
            }
        }
        const responseModel: ListRSEsResponse = {
            status: 'success',
            name: dto.name,
            id: dto.id,
            rse_type: dto.rse_type,
            volatile: dto.volatile,
            deterministic: dto.deterministic,
            staging_area: dto.staging_area,
        }
        return {
            data: responseModel,
            status: 'success',
        }
    }

}
