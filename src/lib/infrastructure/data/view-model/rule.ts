import { AccountInfo, DIDLong, DIDType, Rule, RuleMeta, RulePageLockEntry, RuleState } from '@/lib/core/entity/rucio';
import { BaseViewModel } from '@/lib/sdk/view-models';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';

export interface RuleViewModel extends Rule, BaseViewModel {}

export interface RulePageLockEntryViewModel extends RulePageLockEntry, BaseViewModel {}

export interface RuleMetaViewModel extends RuleMeta, BaseViewModel {}

export interface RuleSummaryViewModel extends BaseViewModel {
    RSEViewModels: Array<RSEAccountUsageLimitViewModel>;
    DIDViewModels: Array<DIDLong>;
    expirydate: Date;
    lifetime: number;
    notifications: boolean;
    asynchronousMode: boolean;
    numcopies: number;
    takeSamples: boolean;
    numsamples: number;
    groupby: DIDType;
    comment: string;
    approval: boolean;
    accountInfo: AccountInfo;
}

export const generateEmptyRuleViewModel = (): RuleViewModel => {
    return {
        account: '',
        created_at: '',
        id: '',
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
