import { AccountInfo, DIDLong, DIDType, Rule } from "@/lib/core/entity/rucio";
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
