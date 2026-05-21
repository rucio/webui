import { DIDDatasetReplicas, FileReplicaState } from '../entity/rucio';
import { BaseDTO, BaseStreamableDTO } from '@/lib/sdk/dto';

/**
 * Represents a data transfer object for listing replicas.
 * Inherits properties from BaseStreamableDTO.
 * Contains the stream object which contains the data.
 */
export interface ListReplicasDTO extends BaseStreamableDTO {}

/**
 * Represents file replica state.
 */
export interface FileReplicaStateDTO extends BaseDTO, FileReplicaState {}

/**
 * Represents a data transfer object for listing dataset replicas.
 * The property `rseblocked` is omitted because it cannot be obtained from the Rucio server.
 * This property depends on policy packages and therefore the information cannoe be obtained in a way
 * that works for all communities.
 */
export interface DatasetReplicasDTO extends BaseDTO, Omit<DIDDatasetReplicas, 'rseblocked'> {}

/**
 * Represents a single suspicious replica returned by the list suspicious replicas endpoint.
 */
export interface SuspiciousReplicaDTO extends BaseDTO {
    scope: string;
    name: string;
    rse: string;
    rseId: string;
    cnt: number;
    createdAt: string;
}

/**
 * Data Transfer Object for the list suspicious replicas endpoint.
 * The Rucio server returns a single JSON array, so this DTO is non-streaming
 * and exposes the full list of {@link SuspiciousReplicaDTO} items via `replicas`.
 */
export interface ListSuspiciousReplicasDTO extends BaseDTO {
    replicas: SuspiciousReplicaDTO[];
}

/**
 * Data Transfer Object for the DeclareBadPFNs endpoint.
 * The Rucio server returns a plain-text `Created` body on success, so the DTO
 * only carries a `created` flag plus the standard error metadata from BaseDTO.
 */
export interface DeclareBadPFNsDTO extends BaseDTO {
    created: boolean;
}

/**
 * A single replica (scope, name, rse) that Rucio refused to mark bad on a
 * `POST /replicas/bad/dids` call. Empty list on the wire == full success.
 */
export interface NotDeclaredReplicaDTO {
    scope: string;
    name: string;
    rse: string;
    reason?: string;
}

/**
 * Data Transfer Object for the DeclareBadReplicas endpoint
 * (`POST /replicas/bad/dids`). On success the body is a JSON array of replicas
 * the server *refused* to mark bad (or an empty array on full success).
 */
export interface DeclareBadReplicasDTO extends BaseDTO {
    notDeclared: NotDeclaredReplicaDTO[];
}
