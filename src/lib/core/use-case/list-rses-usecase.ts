import { injectable } from "inversify";
import { BaseSingleEndpointStreamingUseCase } from "@/lib/sdk/usecase"
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";

import { ListRSEsError, ListRSEsRequest, ListRSEsResponse } from "@/lib/core/usecase-models/list-rses-usecase-models";
import { ListRSEsInputPort, type ListRSEsOutputPort } from "@/lib/core/port/primary/list-rses-ports";
import { RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";

import { ListRSEsDTO } from "@/lib/core/dto/rse-dto";
import { RSEDTO} from "@/lib/core/dto/rse-dto";
import type RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";

@injectable()
export default class ListRSEsUseCase extends BaseSingleEndpointStreamingUseCase<AuthenticatedRequestModel<ListRSEsRequest>, ListRSEsResponse, ListRSEsError, ListRSEsDTO, RSEDTO, RSEViewModel> implements ListRSEsInputPort {
   
    constructor(
        protected readonly presenter: ListRSEsOutputPort,
        private readonly gateway: RSEGatewayOutputPort,
    ) {
        super(presenter);
    }
    
    validateRequestModel(requestModel: AuthenticatedRequestModel<ListRSEsRequest>): ListRSEsError | undefined {
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
        // TODO: process streamed data
        const errorModel: ListRSEsError = {
                status: 'error',
                code: 400,
                message: 'Gateway recieved an invalid (undefined) response for the query',
                name: 'Gateway Error: Undefined response in stream',
        }
        
        // TODO: convert to response model
        const responseModel: ListRSEsResponse = {
            ...dto,
            status: 'success',
        }
        return {
            status: 'success',
            data: responseModel,
        }
    }
}