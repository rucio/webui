import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';

/**
 * @interface ListSuspiciousReplicasRequest represents the RequestModel for list_suspicious_replicas usecase
 */
export interface ListSuspiciousReplicasRequest {
    rseExpression?: string;
    youngerThan?: string;
    nattempts?: number;
}

/**
 * @interface ListSuspiciousReplicasResponse represents the ResponseModel for list_suspicious_replicas usecase.
 * Each instance corresponds to a single suspicious replica entry from the Rucio server.
 */
export interface ListSuspiciousReplicasResponse extends BaseResponseModel {
    scope: string;
    name: string;
    rse: string;
    rseId: string;
    cnt: number;
    createdAt: string;
}

/**
 * @interface ListSuspiciousReplicasError represents the ErrorModel for list_suspicious_replicas usecase
 */
export interface ListSuspiciousReplicasError extends BaseErrorResponseModel {}
