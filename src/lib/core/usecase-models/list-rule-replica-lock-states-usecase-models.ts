import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { RulePageLockEntry } from '@/lib/core/entity/rucio';
/**
 * @interface ListRuleReplicaLockStatesRequest represents the RequestModel for list_rule_replica_lock_states usecase
 */
export interface ListRuleReplicaLockStatesRequest {
    id: string;
}

/**
 * @interface ListRuleReplicaLockStatesResponse represents the ResponseModel for list_rule_replica_lock_states usecase
 */
export interface ListRuleReplicaLockStatesResponse extends BaseResponseModel, RulePageLockEntry {}

/**
 * @interface ListRuleReplicaLockStatesError represents the ErrorModel for list_rule_replica_lock_states usecase
 */
export interface ListRuleReplicaLockStatesError extends BaseErrorResponseModel {}
