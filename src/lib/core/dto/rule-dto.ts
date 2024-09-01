import { BaseDTO } from '@/lib/sdk/dto';
import { LockState, Rule } from '../entity/rucio';

/**
 * The Data Transfer Object for the ListRulesEndpoint which contains the stream
 */
export interface RuleDTO extends BaseDTO, Rule {}

/**
 * Data Transfer Object for Rule Replica Locks
 */
export interface RuleReplicaLockStateDTO extends BaseDTO {
    scope: string;
    name: string;
    rse: string;
    state: LockState;
}
