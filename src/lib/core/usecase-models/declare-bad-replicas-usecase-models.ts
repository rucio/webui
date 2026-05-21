import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { NotDeclaredReplicaDTO } from '@/lib/core/dto/replica-dto';

/**
 * @interface DeclareBadReplicasRequest represents the RequestModel for the
 * declare_bad_replicas usecase (POST /replicas/bad/dids on the Rucio server).
 */
export interface DeclareBadReplicasRequest {
    dids: Array<{ scope: string; name: string }>;
    rse: string;
    reason: string;
    /** ISO-like timestamp accepted by Rucio (`%Y-%m-%dT%H:%M:%S`); null/undefined = no expiry. */
    expiresAt?: string | null;
}

/**
 * @interface DeclareBadReplicasResponse — replicas the server *refused* to mark bad.
 * An empty `notDeclared` list means every supplied replica was accepted.
 */
export interface DeclareBadReplicasResponse extends BaseResponseModel {
    notDeclared: NotDeclaredReplicaDTO[];
}

/**
 * @interface DeclareBadReplicasError represents the ErrorModel for the usecase.
 */
export interface DeclareBadReplicasError extends BaseErrorResponseModel {}
