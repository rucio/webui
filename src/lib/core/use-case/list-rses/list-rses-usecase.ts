import { injectable } from "inversify";
import { BaseSingleEndpointPostProcessingPipelineStreamingUseCase } from "@/lib/sdk/usecase";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";

import { ListRSEsError, ListRSEsRequest, ListRSEsResponse } from "@/lib/core/usecase-models/list-rses-usecase-models";
import { RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";

import type RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";
import { ListRSEsDTO } from "@/lib/core/dto/rse-dto";
import { RSEDTO } from "@/lib/core/dto/rse-dto";

import { ListRSEsInputPort, type ListRSEsOutputPort } from "@/lib/core/port/primary/list-rses-ports";


import GetRSEPipelineElement from "./pipeline-element-get-rse-pipeline-element";


@injectable()
export default class ListRSEsUseCase extends BaseSingleEndpointPostProcessingPipelineStreamingUseCase<ListRSEsRequest, ListRSEsResponse, ListRSEsError, ListRSEsDTO, RSEDTO, RSEViewModel> implements ListRSEsInputPort {

  constructor(
    protected readonly presenter: ListRSEsOutputPort,
    private readonly gateway: RSEGatewayOutputPort,
    
    readonly rseGateway: RSEGatewayOutputPort,
    
  ) {
    const pipelineElements = [
      new GetRSEPipelineElement(rseGateway),
    ];
    super(presenter, pipelineElements);
    this.gateway = gateway;
  }

  validateRequestModel(requestModel: AuthenticatedRequestModel<ListRSEsRequest>): ListRSEsError | undefined {
    if(requestModel.rseExpression === undefined || requestModel.rseExpression === '') {
        return {
            status: 'error',
            code: 400,
            name: 'Invalid RSE Expression',
            error: 'Invalid RSE Expression',
            message: 'RSE Expression is undefined or an empty string',
        } as ListRSEsError
    }
    return undefined;
  }

  async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListRSEsRequest>): Promise<ListRSEsDTO> {
    const { rucioAuthToken, rseExpression } = requestModel;
    const dto: ListRSEsDTO = await this.gateway.listRSEs(rucioAuthToken, rseExpression);
    return dto;
  }

  handleGatewayError(error: ListRSEsDTO): ListRSEsError {
    return {
        status: 'error',
        error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
        message: error.errorMessage? error.errorMessage : 'Gateway Error',
        name: `Gateway Error`,
        code: error.errorCode,
    } as ListRSEsError
  }

  processStreamedData(dto: RSEDTO): { data: ListRSEsResponse | ListRSEsError; status: "success" | "error"; } {
    if(dto.status === 'error') {
        const errorModel: ListRSEsError = {
                status: 'error',
                code: dto.errorCode || 500,
                message: dto.errorMessage || 'Could not fetch or process the fetched data',
                name: dto.errorName || 'Gateway Error',
        }
        return {
            status: 'error',
            data: errorModel,
        }
    }
    const responseModel: ListRSEsResponse = {
        ...dto,
        status: 'success',
    }
    return {
        status: 'success',
        data: responseModel,
    }
  }

  validateFinalResponseModel(responseModel: ListRSEsResponse ): { isValid: boolean; errorModel?: ListRSEsError | undefined; } {
        return {
            isValid: true,
        }
  }
}
