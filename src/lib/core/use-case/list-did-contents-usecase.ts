import { injectable } from "inversify";
import { BaseSingleEndpointStreamingUseCase } from "@/lib/sdk/usecase"
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";

import { ListDIDContentsError, ListDIDContentsRequest, ListDIDContentsResponse } from "@/lib/core/usecase-models/list-did-contents-usecase-models";
import { ListDIDContentsInputPort, type ListDIDContentsOutputPort } from "@/lib/core/port/primary/list-did-contents-ports";
import { DIDViewModel } from "@/lib/infrastructure/data/view-model/did";

import { ListDIDDTO } from "@/lib/core/dto/did-dto";
import { DIDDTO} from "@/lib/core/dto/did-dto";
import type DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";

@injectable()
export default class ListDIDContentsUseCase extends BaseSingleEndpointStreamingUseCase<AuthenticatedRequestModel<ListDIDContentsRequest>, ListDIDContentsResponse, ListDIDContentsError, ListDIDDTO, DIDDTO, DIDViewModel> implements ListDIDContentsInputPort {
   
    constructor(
        protected readonly presenter: ListDIDContentsOutputPort,
        private readonly gateway: DIDGatewayOutputPort,
    ) {
        super(presenter);
    }
    
    validateRequestModel(requestModel: AuthenticatedRequestModel<ListDIDContentsRequest>): ListDIDContentsError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListDIDContentsRequest>): Promise<ListDIDDTO> {
        const { rucioAuthToken, scope, name } = requestModel;
        const dto: ListDIDDTO = await this.gateway.listDIDContents(rucioAuthToken, scope, name);
        return dto;
    }
    
    handleGatewayError(error: ListDIDDTO): ListDIDContentsError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListDIDContentsError
    }

    processStreamedData(dto: DIDDTO): { data: ListDIDContentsResponse | ListDIDContentsError; status: "success" | "error"; } {
        const responseModel: ListDIDContentsResponse = {
            ...dto,
            status: 'success',
        }
        return {
            status: 'success',
            data: responseModel,
        }
    }
}