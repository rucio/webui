import { injectable } from "inversify";
import { BaseSingleEndpointStreamingUseCase } from "@/lib/sdk/usecase"
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";

import { ListDatasetReplicasError, ListDatasetReplicasRequest, ListDatasetReplicasResponse } from "@/lib/core/usecase-models/list-dataset-replicas-usecase-models";
import { ListDatasetReplicasInputPort, type ListDatasetReplicasOutputPort } from "@/lib/core/port/primary/list-dataset-replicas-ports";
import { DIDDatasetReplicasViewModel } from "@/lib/infrastructure/data/view-model/did";

import { ListReplicasDTO } from "@/lib/core/dto/replica-dto";
import { DatasetReplicasDTO} from "@/lib/core/dto/replica-dto";
import type ReplicaGatewayOutputPort from "@/lib/core/port/secondary/replica-gateway-output-port";

@injectable()
export default class ListDatasetReplicasUseCase extends BaseSingleEndpointStreamingUseCase<AuthenticatedRequestModel<ListDatasetReplicasRequest>, ListDatasetReplicasResponse, ListDatasetReplicasError, ListReplicasDTO, DatasetReplicasDTO, DIDDatasetReplicasViewModel> implements ListDatasetReplicasInputPort {
   
    constructor(
        protected readonly presenter: ListDatasetReplicasOutputPort,
        private readonly gateway: ReplicaGatewayOutputPort,
    ) {
        super(presenter);
    }
    
    validateRequestModel(requestModel: AuthenticatedRequestModel<ListDatasetReplicasRequest>): ListDatasetReplicasError | undefined {
        return undefined;
    }

    async makeGatewayRequest(requestModel: AuthenticatedRequestModel<ListDatasetReplicasRequest>): Promise<ListReplicasDTO> {
        const { rucioAuthToken, scope, name } = requestModel;
        const dto: ListReplicasDTO = await this.gateway.listDatasetReplicas(rucioAuthToken, scope, name);
        return dto;
    }
    
    handleGatewayError(error: ListReplicasDTO): ListDatasetReplicasError {
        return {
            status: 'error',
            error: `Gateway retuned with ${error.errorCode}: ${error.errorMessage}`,
            message: error.errorMessage? error.errorMessage : 'Gateway Error',
            name: `Gateway Error`,
            code: error.errorCode,
        } as ListDatasetReplicasError
    }

    processStreamedData(dto: DatasetReplicasDTO): { data: ListDatasetReplicasResponse | ListDatasetReplicasError; status: "success" | "error"; } {
        if(dto.status === 'error') {
            const errorModel: ListDatasetReplicasError = {
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
        
        const responseModel: ListDatasetReplicasResponse = {
            ...dto,
            status: 'success',
        }
        return {
            status: 'success',
            data: responseModel,
        }
    }
}