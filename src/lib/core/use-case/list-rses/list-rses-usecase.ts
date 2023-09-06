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
        throw new Error("Method not implemented.");
    }
    makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListRSEsRequest>): Promise<ListRSEsDTO> {
        throw new Error("Method not implemented.");
    }
    handleGatewayError(error: ListRSEsDTO): ListRSEsError {
        throw new Error("Method not implemented.");
    }
    validateRequestModel(requestModel: AuthenticatedRequestModel<ListRSEsRequest>): ListRSEsError | undefined {
        throw new Error("Method not implemented.");
    }
    processStreamedData(dto: RSEDTO): { data: ListRSEsResponse | ListRSEsError; status: "error" | "success"; } {
        throw new Error("Method not implemented.");
    }

}
