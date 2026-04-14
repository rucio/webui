import { BaseDTO, BaseStreamableDTO } from '@/lib/sdk/dto';
import { DIDType, LockState, Rule, RuleAnalysis, RuleGrouping, RuleMeta } from '../entity/rucio';

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

export interface ListLocksDTO extends BaseStreamableDTO {}

export interface ListRulesDTO extends BaseStreamableDTO {}

/**
 * Extended Rule DTO that includes additional fields from the Rucio API response
 * (did_type, grouping, comments, bytes) that are not part of the base RuleDTO.
 */
export interface RuleExtendedDTO extends RuleDTO {
    did_type: DIDType;
    grouping: RuleGrouping;
    comments: string | null;
    bytes: number | null;
}

export interface CreateRuleDTO extends BaseDTO {
    rule_ids: string[];
}

export interface UpdateRuleDTO extends BaseDTO {}

export interface DeleteRuleDTO extends BaseDTO {}

export interface RuleAnalysisDTO extends BaseDTO, RuleAnalysis {}
