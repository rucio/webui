import { injectable } from "inversify";
import { BaseSingleEndpointStreamingUseCase } from "@/lib/sdk/usecase"
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";

import { ListFileReplicasError, ListFileReplicasRequest, ListFileReplicasResponse } from "@/lib/core/usecase-models/list-file-replicas-usecase-models";
import { ListFileReplicasInputPort, type ListFileReplicasOutputPort } from "@/lib/core/port/primary/list-file-replicas-ports";
import { FilereplicaStateViewModel } from "@/lib/infrastructure/data/view-model/did";

import { ListReplicasDTO } from "@/lib/core/dto/replica-dto";
import { FileReplicaStateDTO} from "@/lib/core/dto/replica-dto";
import type ReplicaGatewayOutputPort from "@/lib/core/port/secondary/replica-gateway-output-port";

@injectable()
export default class ListFileReplicasUseCase extends BaseSingleEndpointStreamingUseCase<AuthenticatedRequestModel<ListFileReplicasRequest>, ListFileReplicasResponse, ListFileReplicasError, ListReplicasDTO, FileReplicaStateDTO, FilereplicaStateViewModel> implements ListFileReplicasInputPort {
   
    constructor(
        protected readonly presenter: ListFileReplicasOutputPort,
        private readonly gateway: ReplicaGatewayOutputPort,
    ) {
        super(presenter);
    }
    
    validateRequestModel(requestModel: AuthenticatedRequestModel<ListFileReplicasRequest>): ListFileReplicasError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListFileReplicasRequest>): Promise<ListReplicasDTO> {
        const { rucioAuthToken, scope, name } = requestModel;
        const dto: ListReplicasDTO = await this.gateway.listFileReplicas(rucioAuthToken, scope, name);
        return dto;
    }
    
    handleGatewayError(error: ListReplicasDTO): ListFileReplicasError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListFileReplicasError
    }

    processStreamedData(dto: FileReplicaStateDTO): { data: ListFileReplicasResponse | ListFileReplicasError; status: "success" | "error"; } {
        const errorModel: ListFileReplicasError = {
                status: 'error',
                code: 400,
                message: 'Gateway recieved an invalid (undefined) response for the query',
                name: 'Gateway Error: Undefined response in stream',
        }
        
        const responseModel: ListFileReplicasResponse = {
            ...dto,
            status: 'success',
        }
        return {
            status: 'success',
            data: responseModel,
        }
    }
}