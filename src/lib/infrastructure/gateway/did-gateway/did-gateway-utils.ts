import { DIDDTO, DIDRulesDTO } from '@/lib/core/dto/did-dto';
import { DIDType, RuleState } from '@/lib/core/entity/rucio';
import { getRuleGrouping, getRuleNotification } from '@/lib/infrastructure/gateway/rule-gateway/rule-gateway-utils';

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
export type TRucioRules = {
    id: string;
    subscription_id: null;
    account: string;
    scope: string;
    name: string;
    did_type: string;
    state: string;
    error: null;
    rse_expression: string;
    copies: number;
    expires_at: null;
    weight: null;
    locked: boolean;
    locks_ok_cnt: number;
    locks_replicating_cnt: number;
    locks_stuck_cnt: number;
    source_replica_expression: string;
    activity: string;
    grouping: string;
    updated_at: string;
    created_at: string;
    notification: string;
};

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
        activity: data.activity,
        copies: data.copies,
        created_at: data.created_at,
        did_type: getDIDType(data.did_type),
        expires_at: data.expires_at,
        grouping: getRuleGrouping(data.grouping),
        ignore_account_limit: false,
        ignore_availability: false,
        locked: data.locked,
        locks_ok_cnt: data.locks_ok_cnt,
        locks_replicating_cnt: data.locks_replicating_cnt,
        locks_stuck_cnt: data.locks_stuck_cnt,
        notification: getRuleNotification(data.notification),
        priority: 0,
        purge_replicas: false,
        rse_expression: data.rse_expression,
        scope: data.scope,
        split_container: false,
        updated_at: data.updated_at,
        status: 'success',
        id: data.id,
        name: data.name,
        state: state,
        account: data.account,
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
