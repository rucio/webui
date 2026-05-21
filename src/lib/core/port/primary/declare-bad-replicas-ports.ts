import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    DeclareBadReplicasError,
    DeclareBadReplicasRequest,
    DeclareBadReplicasResponse,
} from '@/lib/core/usecase-models/declare-bad-replicas-usecase-models';

/**
 * @interface DeclareBadReplicasInputPort representing the DeclareBadReplicas usecase.
 */
export interface DeclareBadReplicasInputPort extends BaseAuthenticatedInputPort<DeclareBadReplicasRequest> {}

/**
 * @interface DeclareBadReplicasOutputPort representing the DeclareBadReplicas presenter.
 */
export interface DeclareBadReplicasOutputPort extends BaseOutputPort<DeclareBadReplicasResponse, DeclareBadReplicasError> {}
