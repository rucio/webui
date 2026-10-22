import { FileReplicaState } from '../entity/rucio';
import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';

/**
 * @interface ListFileReplicasRequest represents the RequestModel for list_file_replicas usecase.
 * The optional fields mirror the options of `rucio replica list file`.
 */
export interface ListFileReplicasRequest {
    name: string;
    scope: string;
    schemes?: string[];
    domain?: 'wan' | 'lan' | 'all';
    rseExpression?: string;
    allStates?: boolean;
    clientIp?: string;
}

/**
 * @interface ListFileReplicasResponse represents the ResponseModel for list_file_replicas usecase
 */
export interface ListFileReplicasResponse extends FileReplicaState, BaseResponseModel {}

export type ListFileReplicasErrorType = 'unauthorized' | 'invalid_rse_expression' | 'invalid_domain' | 'invalid_scheme' | 'server_busy' | 'unknown';

/**
 * @interface ListFileReplicasError represents the ErrorModel for list_file_replicas usecase
 */
export interface ListFileReplicasError extends BaseErrorResponseModel {
    errorType?: ListFileReplicasErrorType;
}
