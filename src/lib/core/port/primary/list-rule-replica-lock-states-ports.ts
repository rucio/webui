import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from '@/lib/sdk/primary-ports';
import {
    ListRuleReplicaLockStatesResponse,
    ListRuleReplicaLockStatesRequest,
    ListRuleReplicaLockStatesError,
} from '@/lib/core/usecase-models/list-rule-replica-lock-states-usecase-models';
import { ListRuleReplicaLockStatesViewModel } from '@/lib/infrastructure/data/view-model/rule';
/**
 * @interface ListRuleReplicaLockStatesInputPort that abstracts the usecase.
 */
export interface ListRuleReplicaLockStatesInputPort extends BaseAuthenticatedInputPort<ListRuleReplicaLockStatesRequest> {}

// TODO: Add viewmodel
/**
 * @interface ListRuleReplicaLockStatesOutputPort that abtrsacts the presenter
 */
export interface ListRuleReplicaLockStatesOutputPort
    extends BaseStreamingOutputPort<ListRuleReplicaLockStatesResponse, ListRuleReplicaLockStatesError, ListRuleReplicaLockStatesViewModel> {}
