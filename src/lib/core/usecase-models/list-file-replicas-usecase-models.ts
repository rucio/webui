import { FilereplicaState } from "@/lib/infrastructure/data/view-model/page-did"
import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
/**
 * @interface ListFileReplicasRequest represents the RequestModel for list_file_replicas usecase
*/
export interface ListFileReplicasRequest {
    name: string
    scope: string
}

/** 
 * @interface ListFileReplicasResponse represents the ResponseModel for list_file_replicas usecase
*/
export interface ListFileReplicasResponse extends FilereplicaState, BaseResponseModel {}


/**
* @interface ListFileReplicasError represents the ErrorModel for list_file_replicas usecase
*/
export interface ListFileReplicasError extends BaseErrorResponseModel {}