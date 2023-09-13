import { DIDDTO, DIDRulesDTO } from "@/lib/core/dto/did-dto";
import { DIDType, RuleState } from "@/lib/core/entity/rucio";


/**
 * The type representing a Rucio DID returned by Rucio REST API
 */
export type TRucioDID = {
    scope: string;
    name: string;
    type: string;
}

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
}

function getRuleState(state: string): RuleState {
    switch(state.toUpperCase()) {
        case 'REPLICATING':
            return RuleState.REPLICATING
        case 'OK':
            return RuleState.OK
        case 'STUCK':
            return RuleState.STUCK
        case 'SUSPENDED':
            return RuleState.SUSPENDED
        case 'WAITING_APPROVAL':
            return RuleState.WAITING_APPROVAL
        case 'INJECT':
            return RuleState.INJECT
        default:
            return RuleState.UNKNOWN
    }
}

function getDIDType(type: string): DIDType {
    switch(type.toUpperCase()) {
        case 'CONTAINER':
            return DIDType.CONTAINER
        case 'DATASET':
            return DIDType.DATASET
        case 'FILE':
            return DIDType.FILE
        default:
            return DIDType.UNKNOWN
    }
}
export function convertToDIDRulesDTO(data: TRucioRules): DIDRulesDTO {
    const state: RuleState = getRuleState(data.state)
    const dto: DIDRulesDTO = {
        status: 'success',
        id: data.id,
        name: data.name,
        state: state,
        account: data.account, 
        last_modified: data.updated_at,
        subscription_id: data.subscription_id?? undefined,
    }
    return dto
}

export function convertToDIDDTO(data: TRucioDID): DIDDTO {
    const type: DIDType = getDIDType(data.type)
    const dto: DIDDTO = {
        status: 'success',
        scope: data.scope,
        name: data.name,
        did_type: type,
    }
    return dto
}