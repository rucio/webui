import { AccountInfo, DIDLong, DIDType, Rule, RuleState } from "@/lib/core/entity/rucio";
import { RulePageLockEntry, RuleMeta } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";
import { DIDName, RSEName } from "./create-rule";
import { RSEAccountUsageLimitViewModel } from "./rse";

export interface RuleViewModel extends Rule, BaseViewModel {}
export interface RulePageLockEntryViewModel extends RulePageLockEntry, BaseViewModel {}
export interface RuleMetaViewModel extends RuleMeta, BaseViewModel {}
export interface RuleSummaryViewModel extends BaseViewModel {
    DIDList: Array<DIDName>
    RSEList: Array<RSEName>
    RSEViewModels: Array<RSEAccountUsageLimitViewModel>
    DIDViewModels: Array<DIDLong>
    expirydate: Date
    lifetime: number
    notifications: boolean
    asynchronousMode: boolean
    numcopies: number
    takeSamples: boolean
    numsamples: number
    groupby: DIDType
    comment: string
    approval: boolean
    accountInfo: AccountInfo
}


export function generateEmptyRuleViewModel() {
    const emptyRuleModel: RuleViewModel = {
        status: 'error',
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
    }
    return emptyRuleModel;
}