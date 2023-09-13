import { DIDDatasetReplicas, FilereplicaState } from "../entity/rucio";
import { BaseDTO, BaseStreamableDTO } from "@/lib/sdk/dto";

/**
 * Represents a data transfer object for listing replicas.
 * Inherits properties from BaseStreamableDTO.
 * Contains the stream object which contains the data.
 */
export interface ListReplicasDTO extends BaseStreamableDTO {}

/**
 * Represents file replica state.
 */
export interface FileReplicaStateDTO extends BaseDTO, FilereplicaState {}


/**
 * Represents a data transfer object for listing dataset replicas.
 * The property `rseblocked` is omitted because it cannot be obtained from the Rucio server.
 * This property depends on policy packages and therefore the information cannoe be obtained in a way
 * that works for all communities.
 */
export interface DatasetReplicasDTO extends BaseDTO, Omit<DIDDatasetReplicas, 'rseblocked'> {}
