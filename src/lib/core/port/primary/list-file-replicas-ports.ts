import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from '@/lib/sdk/primary-ports';
import {
    ListFileReplicasResponse,
    ListFileReplicasRequest,
    ListFileReplicasError,
} from '@/lib/core/usecase-models/list-file-replicas-usecase-models';
import { FilereplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did';

/**
 * @interface ListFileReplicasInputPort that abstracts the usecase.
 */
export interface ListFileReplicasInputPort extends BaseAuthenticatedInputPort<ListFileReplicasRequest> {}

/**
 * @interface ListFileReplicasOutputPort that abtrsacts the presenter
 */
export interface ListFileReplicasOutputPort
    extends BaseStreamingOutputPort<ListFileReplicasResponse, ListFileReplicasError, FilereplicaStateViewModel> {}
