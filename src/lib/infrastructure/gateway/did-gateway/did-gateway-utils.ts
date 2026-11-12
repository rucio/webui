import { DIDDTO, DIDRulesDTO } from '@/lib/core/dto/did-dto';
import { DIDType, RuleState } from '@/lib/core/entity/rucio';
import { getRuleGrouping, getRuleNotification, TRucioRule } from '@/lib/infrastructure/gateway/rule-gateway/rule-gateway-utils';

/**
 * The type representing a Rucio DID returned by Rucio REST API
 */
export type TRucioDID = {
    scope: string;
    name: string;
    type: string;
};

/**
 * The type representing a Rucio Rule returned by Rucio REST API
 */
export type TRucioRules = TRucioRule;

function getRuleState(state: string): RuleState {
    switch (state.toUpperCase()) {
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

function getDIDType(type: string): DIDType {
    switch (type.toUpperCase()) {
        case 'CONTAINER':
            return DIDType.CONTAINER;
        case 'DATASET':
            return DIDType.DATASET;
        case 'FILE':
            return DIDType.FILE;
        default:
            return DIDType.UNKNOWN;
    }
}
export function convertToDIDRulesDTO(data: TRucioRules): DIDRulesDTO {
    const state: RuleState = getRuleState(data.state);
    const dto: DIDRulesDTO = {
        account: data.account,
        activity: data.activity,
        child_rule_id: data.child_rule_id ?? null,
        comments: null,
        copies: data.copies,
        created_at: data.created_at,
        did_type: getDIDType(data.did_type),
        eol_at: data.eol_at ?? null,
        error: data.error ?? null,
        expires_at: data.expires_at,
        grouping: getRuleGrouping(data.grouping),
        id: data.id,
        ignore_account_limit: false,
        ignore_availability: false,
        locked: data.locked,
        locks_ok_cnt: data.locks_ok_cnt,
        locks_replicating_cnt: data.locks_replicating_cnt,
        locks_stuck_cnt: data.locks_stuck_cnt,
        name: data.name,
        notification: getRuleNotification(data.notification),
        meta: data.meta ?? null,
        priority: 0,
        purge_replicas: false,
        rse_expression: data.rse_expression,
        scope: data.scope,
        source_replica_expression: data.source_replica_expression ?? null,
        split_container: false,
        state: state,
        status: 'success',
        stuck_at: data.stuck_at ?? null,
        subscription_id: data.subscription_id ?? null,
        updated_at: data.updated_at,
        weight: data.weight ?? null,
    };
    return dto;
}

export function convertToDIDDTO(data: TRucioDID): DIDDTO {
    const type: DIDType = getDIDType(data.type);
    const dto: DIDDTO = {
        status: 'success',
        scope: data.scope,
        name: data.name,
        did_type: type,
    };
    return dto;
}
