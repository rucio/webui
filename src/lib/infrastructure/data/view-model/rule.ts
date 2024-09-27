import { Rule, RuleMeta, RulePageLockEntry, RuleState } from '@/lib/core/entity/rucio';
import { BaseViewModel } from '@/lib/sdk/view-models';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { DIDLongViewModel } from '@/lib/infrastructure/data/view-model/did';
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

    hasSampling: boolean;
    sampleCount?: number;

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
        hasSampling: false,
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
