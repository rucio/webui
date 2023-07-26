import { Rule } from "@/lib/core/entity/rucio";
import { RulePageLockEntry, RuleMeta } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";

export interface RuleViewModel extends Rule, BaseViewModel {}
export interface RulePageLockEntryViewModel extends RulePageLockEntry, BaseViewModel {}
export interface RuleMetaViewModel extends RuleMeta, BaseViewModel {}