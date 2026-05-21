import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from '@/lib/sdk/primary-ports';
import { BaseViewModel } from '@/lib/sdk/view-models';
import {
    ListSuspiciousReplicasRequest,
    ListSuspiciousReplicasResponse,
    ListSuspiciousReplicasError,
} from '@/lib/core/usecase-models/list-suspicious-replicas-usecase-models';

/**
 * @interface ListSuspiciousReplicasInputPort that abstracts the usecase.
 */
export interface ListSuspiciousReplicasInputPort extends BaseAuthenticatedInputPort<ListSuspiciousReplicasRequest> {}

/**
 * @interface ListSuspiciousReplicasOutputPort that abstracts the presenter.
 */
export interface ListSuspiciousReplicasOutputPort
    extends BaseStreamingOutputPort<ListSuspiciousReplicasResponse, ListSuspiciousReplicasError, BaseViewModel> {}
