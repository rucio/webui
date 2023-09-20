import { injectable } from "inversify";
import { BaseSingleEndpointStreamingUseCase } from "@/lib/sdk/usecase"
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";

import { ListDIDParentsError, ListDIDParentsRequest, ListDIDParentsResponse } from "@/lib/core/usecase-models/list-did-parents-usecase-models";
import { ListDIDParentsInputPort, type ListDIDParentsOutputPort } from "@/lib/core/port/primary/list-did-parents-ports";
import { DIDViewModel } from "@/lib/infrastructure/data/view-model/did";

import { ListDIDDTO } from "@/lib/core/dto/did-dto";
import { DIDDTO} from "@/lib/core/dto/did-dto";
import type DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";

@injectable()
export default class ListDIDParentsUseCase extends BaseSingleEndpointStreamingUseCase<AuthenticatedRequestModel<ListDIDParentsRequest>, ListDIDParentsResponse, ListDIDParentsError, ListDIDDTO, DIDDTO, DIDViewModel> implements ListDIDParentsInputPort {
   
    constructor(
        protected readonly presenter: ListDIDParentsOutputPort,
        private readonly gateway: DIDGatewayOutputPort,
    ) {
        super(presenter);
    }
    
    validateRequestModel(requestModel: AuthenticatedRequestModel<ListDIDParentsRequest>): ListDIDParentsError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListDIDParentsRequest>): Promise<ListDIDDTO> {
        const { rucioAuthToken, scope, name } = requestModel;
        const dto: ListDIDDTO = await this.gateway.listDIDParents(rucioAuthToken, scope, name);
        return dto;
    }
    
    handleGatewayError(error: ListDIDDTO): ListDIDParentsError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListDIDParentsError
    }

    processStreamedData(dto: DIDDTO): { data: ListDIDParentsResponse | ListDIDParentsError; status: "success" | "error"; } {
        if(dto.status === 'error') {
            const errorModel: ListDIDParentsError = {
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
        const responseModel: ListDIDParentsResponse = {
            ...dto,
            status: 'success',
        }
        return {
            status: 'success',
            data: responseModel,
        }
    }
}