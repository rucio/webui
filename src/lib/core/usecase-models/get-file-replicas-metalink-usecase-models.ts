import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { FileReplicasErrorType } from '@/lib/core/utils/file-replicas-utils';

/**
 * @interface GetFileReplicasMetalinkRequest represents the RequestModel for the get_file_replicas_metalink usecase.
 * It takes the same options as list_file_replicas (`rucio replica list file --metalink`).
 */
export interface GetFileReplicasMetalinkRequest {
    scope: string;
    name: string;
    schemes?: string[];
    domain?: 'wan' | 'lan' | 'all';
    rseExpression?: string;
    allStates?: boolean;
    clientIp?: string;
}

/**
 * @interface GetFileReplicasMetalinkResponse carries the metalink4 XML document.
 */
export interface GetFileReplicasMetalinkResponse extends BaseResponseModel {
    xml: string;
}

export type GetFileReplicasMetalinkErrorType = FileReplicasErrorType;

/**
 * @interface GetFileReplicasMetalinkError represents the ErrorModel for the usecase.
 */
export interface GetFileReplicasMetalinkError extends BaseErrorResponseModel {
    errorType?: GetFileReplicasMetalinkErrorType;
}
