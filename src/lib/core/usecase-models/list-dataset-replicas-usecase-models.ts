import { DIDDatasetReplicas } from "@/lib/infrastructure/data/view-model/page-did";
import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
/**
 * @interface ListDatasetReplicasRequest represents the RequestModel for list_dataset_replicas usecase
*/
export interface ListDatasetReplicasRequest {
    scope: string;
    name: string;
}

/** 
 * @interface ListDatasetReplicasResponse represents the ResponseModel for list_dataset_replicas usecase
 * Omitting "rseblocked" because it requires a Rucio endpoint that does not currently exists.
*/
export interface ListDatasetReplicasResponse extends Omit<DIDDatasetReplicas, "rseblocked">, BaseResponseModel {}


/**
* @interface ListDatasetReplicasError represents the ErrorModel for list_dataset_replicas usecase
*/
export interface ListDatasetReplicasError extends BaseErrorResponseModel {}