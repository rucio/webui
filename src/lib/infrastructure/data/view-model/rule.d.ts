import { AccountInfo, Rule } from "@/lib/core/entity/rucio";
import { RulePageLockEntry, RuleMeta } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";

export interface RuleViewModel extends Rule, BaseViewModel {}
export interface RulePageLockEntryViewModel extends RulePageLockEntry, BaseViewModel {}
export interface RuleMetaViewModel extends RuleMeta, BaseViewModel {}
export interface RuleSummaryViewModel extends BaseViewModel {
    DIDList: Array<DIDName>
    RSEList: Array<RSEName>
    RSEViewModels: Array<RSEAccountUsageLimitViewModel>
    DIDViewModels: Array<DIDLong>
    expirydate: Date
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
