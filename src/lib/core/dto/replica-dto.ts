import { FilereplicaState } from "@/lib/infrastructure/data/view-model/page-did"; // TODO: Move to entity, breaks clean architecture
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