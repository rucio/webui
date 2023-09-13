import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from "@/lib/sdk/primary-ports";
import { ListDatasetReplicasResponse, ListDatasetReplicasRequest, ListDatasetReplicasError } from "@/lib/core/usecase-models/list-dataset-replicas-usecase-models";
import { DIDDatasetReplicasViewModel } from "@/lib/infrastructure/data/view-model/did";
/**
 * @interface ListDatasetReplicasInputPort that abstracts the usecase.
 */
export interface ListDatasetReplicasInputPort extends BaseAuthenticatedInputPort<ListDatasetReplicasRequest> {}

/**
 * @interface ListDatasetReplicasOutputPort that abtrsacts the presenter
 */
export interface ListDatasetReplicasOutputPort extends BaseStreamingOutputPort<ListDatasetReplicasResponse, ListDatasetReplicasError, DIDDatasetReplicasViewModel> {}
