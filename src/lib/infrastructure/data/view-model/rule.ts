import { DIDType, LockState, Rule, RuleGrouping, RuleMeta, RuleNotification, RulePageLockEntry, RuleState } from '@/lib/core/entity/rucio';
import { BaseViewModel } from '@/lib/sdk/view-models';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';

export interface RuleViewModel extends Rule, BaseViewModel {}

export interface RulePageLockEntryViewModel extends RulePageLockEntry, BaseViewModel {}

export interface RuleMetaViewModel extends RuleMeta, BaseViewModel {}

export enum CreateRuleGrouping {
    ALL = 'All',
    DATASET = 'Dataset',
    NONE = 'None',
}

export interface CreateRuleOptions {
    copies: number;

    daysLifetime?: number;
    notify: boolean;
    asynchronous: boolean;
    grouping?: CreateRuleGrouping;

    sample: boolean;
    sampleFileCount?: number;

    comments?: string;
}

export interface CreateRuleStorage {
    rses: RSEAccountUsageLimitViewModel[];
    rseExpression?: string;
}

export interface CreateRuleParameters extends CreateRuleOptions, CreateRuleStorage {
    dids: ListDIDsViewModel[];
    needsApproval: boolean;
    askApproval: boolean;
}

export const getEmptyCreateRuleParameters = (): CreateRuleParameters => {
    return {
        askApproval: false,
        needsApproval: false,
        asynchronous: false,
        copies: 1,
        daysLifetime: undefined,
        dids: [],
        grouping: undefined,
        sample: false,
        notify: false,
        rses: [],
    };
};

export const generateEmptyRuleViewModel = (): RuleViewModel => {
    return {
        account: '',
        created_at: '',
        id: '',
        scope: '',
        locks_ok_cnt: 0,
        locks_replicating_cnt: 0,
        locks_stuck_cnt: 0,
        name: '',
        remaining_lifetime: 0,
        rse_expression: '',
        state: RuleState.UNKNOWN,
        status: 'error',
    };
};

export interface CreateRuleViewModel extends BaseViewModel {
    rule_ids: string[];
}

export const getEmptyCreateRuleViewModel = (): CreateRuleViewModel => {
    return {
        status: 'error',
        rule_ids: [],
    };
};

export interface GetRuleViewModel extends BaseViewModel, RuleMeta {}
export const getEmptyGetRuleViewModel = (): GetRuleViewModel => {
    return {
        status: 'error',
        account: '',
        activity: '',
        copies: 0,
        created_at: '',
        did_type: DIDType.UNKNOWN,
        expires_at: null,
        grouping: RuleGrouping.NONE,
        id: '',
        ignore_account_limit: false,
        ignore_availability: false,
        locked: false,
        locks_ok_cnt: 0,
        locks_replicating_cnt: 0,
        locks_stuck_cnt: 0,
        name: '',
        notification: RuleNotification.No,
        priority: 0,
        purge_replicas: false,
        rse_expression: '',
        scope: '',
        split_container: false,
        state: RuleState.UNKNOWN,
        updated_at: '',
    };
};

export interface ListRuleReplicaLockStatesViewModel extends BaseViewModel, RulePageLockEntry {}

export const getEmptyListRuleReplicaLockStatesViewModel = (): ListRuleReplicaLockStatesViewModel => {
    return {
        ddm_link: '',
        fts_link: '',
        name: '',
        rse: '',
        scope: '',
        state: LockState.UNKNOWN,
        status: 'error',
    };
};
