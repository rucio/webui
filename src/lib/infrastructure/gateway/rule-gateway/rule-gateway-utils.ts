import { RuleDTO, RuleReplicaLockStateDTO } from '@/lib/core/dto/rule-dto';
import { DateISO, LockState, RuleState } from '@/lib/core/entity/rucio';

export type TRucioRule = {
    error: null | string;
    locks_stuck_cnt: number;
    ignore_availability: boolean;
    meta: null | string;
    subscription_id: null | string;
    rse_expression: string;
    source_replica_expression: null | string;
    ignore_account_limit: boolean;
    created_at: string;
    account: string;
    copies: number;
    activity: string;
    priority: number;
    updated_at: string;
    scope: string;
    expires_at: null | string;
    grouping: string;
    name: string;
    weight: null | number;
    notification: string;
    comments: null | string;
    did_type: string;
    locked: boolean;
    stuck_at: null | string;
    child_rule_id: null | string;
    state: string;
    locks_ok_cnt: number;
    purge_replicas: boolean;
    eol_at: null | string;
    id: string;
    locks_replicating_cnt: number;
    split_container: boolean;
    bytes: null | number;
};

export type TRucioRuleReplicaLock = {
    scope: string;
    name: string;
    rse_id: string;
    rse: string;
    state: string;
    rule_id: string;
};

function getRuleState(state: string): RuleState {
    const cleanState = state.trim().toUpperCase();
    switch (cleanState) {
        case 'REPLICATING':
            return RuleState.REPLICATING;
        case 'OK':
            return RuleState.OK;
        case 'STUCK':
            return RuleState.STUCK;
        case 'SUSPENDED':
            return RuleState.SUSPENDED;
        case 'WAITING_APPROVAL':
            return RuleState.WAITING_APPROVAL;
        case 'INJECT':
            return RuleState.INJECT;
        default:
            return RuleState.UNKNOWN;
    }
}

function getReplicaLockState(state: string): LockState {
    const cleanState = state.trim().toUpperCase();
    switch (cleanState) {
        case 'REPLICATING':
            return LockState.REPLICATING;
        case 'OK':
            return LockState.OK;
        case 'STUCK':
            return LockState.STUCK;
        default:
            return LockState.UNKNOWN;
    }
}

export function convertToRuleDTO(rule: TRucioRule): RuleDTO {
    const millisecondsRemaining = rule.expires_at ? new Date(rule.expires_at).getTime() - Date.now() : 0;

    return {
        status: 'success',
        id: rule.id,
        scope: rule.scope,
        name: rule.name,
        account: rule.account,
        rse_expression: rule.rse_expression,
        created_at: rule.created_at,
        // Convert to seconds
        remaining_lifetime: millisecondsRemaining / 1000,
        state: getRuleState(rule.state),
        locks_ok_cnt: rule.locks_ok_cnt,
        locks_replicating_cnt: rule.locks_replicating_cnt,
        locks_stuck_cnt: rule.locks_stuck_cnt,
    };
}

export function convertToRuleReplicaLockDTO(ruleReplicaLockState: TRucioRuleReplicaLock): RuleReplicaLockStateDTO {
    return {
        status: 'success',
        scope: ruleReplicaLockState.scope,
        name: ruleReplicaLockState.name,
        rse: ruleReplicaLockState.rse,
        state: getReplicaLockState(ruleReplicaLockState.state),
    };
}
export function getEmptyRuleDTO(): RuleDTO {
    return {
        status: 'error',
        scope: '',
        id: '',
        name: '',
        account: '',
        rse_expression: '',
        created_at: '',
        remaining_lifetime: 0,
        state: RuleState.UNKNOWN,
        locks_ok_cnt: 0,
        locks_replicating_cnt: 0,
        locks_stuck_cnt: 0,
    };
}

export function getEmptyRuleReplicaLockDTO(): RuleReplicaLockStateDTO {
    return {
        status: 'error',
        scope: '',
        name: '',
        rse: '',
        state: LockState.UNKNOWN,
    };
}

export type ListRulesFilter = {
    account?: string;
    scope?: string;
    created_after?: Date;
};

export const formatFilterDate = (date: Date) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${dayOfWeek}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} UTC`;
};
