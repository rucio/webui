import { BaseDTO, BaseStreamableDTO } from '@/lib/sdk/dto';
import { LockState, Rule, RuleMeta } from '../entity/rucio';

/**
 * The Data Transfer Object for the ListRulesEndpoint which contains the stream
 */
export interface RuleDTO extends BaseDTO, Rule {}

export interface RuleMetaDTO extends BaseDTO, RuleMeta {}

/**
 * Data Transfer Object for Rule Replica Locks
 */
export interface RuleReplicaLockStateDTO extends BaseDTO {
    scope: string;
    name: string;
    rse: string;
    state: LockState;
}

export interface ListRulesDTO extends BaseStreamableDTO {}

export interface CreateRuleDTO extends BaseDTO {
    rule_ids: string[];
}
