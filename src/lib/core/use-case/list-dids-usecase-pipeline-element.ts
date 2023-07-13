import { BaseStreamingPostProcessingPipelineElement } from "@/lib/sdk/usecase-stream-element";
import { inject } from "inversify";
import { ListDIDDTO } from "../dto/did-dto";
import { ListDIDsError, ListDIDsRequest, ListDIDsResponse } from "../usecase-models/list-dids-usecase-models";

class ListDIDsGetListOfDIDs extends BaseStreamingPostProcessingPipelineElement<
    ListDIDsRequest,
    ListDIDsResponse,
    ListDIDsError,
    ListDIDDTO
>{
    constructor(
        @inject('didGateway') private didGateway: DIDGatewayOutputPort,
    ) {
        super(requestModel, responseModel)
    }
    makeGatewayRequest(requestModel: ListDIDsRequest): Promise<ListDIDDTO> {
        throw new Error("Method not implemented.");
    }
    processDTO(dto: ListDIDDTO): { data: ListDIDsResponse | ListDIDsError; status: "success" | "error"; } {
        throw new Error("Method not implemented.");
    }
    handleGatewayError(error: ListDIDDTO): ListDIDsError {
        throw new Error("Method not implemented.");
    }
    transformResponseModel(responseModel: ListDIDsResponse, dto: ListDIDDTO): ListDIDsResponse {
        throw new Error("Method not implemented.");
    }
}