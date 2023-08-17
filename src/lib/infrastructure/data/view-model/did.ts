import { DID, DIDLong, DIDMeta, RuleState } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";
import { DIDKeyValuePairs, DIDRules, DIDDatasetReplicas, FilereplicaState, FilereplicaStateD } from "./page-did";

export interface DIDViewModel extends DID, BaseViewModel {}
export interface DIDLongViewModel extends DIDLong, BaseViewModel {}

export interface DIDMetaViewModel extends DIDMeta, BaseViewModel {}
export interface DIDKeyValuePairsViewModel extends DIDKeyValuePairs, BaseViewModel {}
export interface DIDRulesViewModel extends DIDRules, BaseViewModel {}
export interface DIDDatasetReplicasViewModel extends DIDDatasetReplicas, BaseViewModel {}
export interface FilereplicaStateViewModel extends FilereplicaState, BaseViewModel {}
export interface FilereplicaStateDViewModel extends FilereplicaStateD, BaseViewModel {}

export function generateEmptyDIDRulesViewModel(): DIDRulesViewModel {
    return {
        status: "error",
        id: "",
        name: "",
        state: RuleState.UNKNOWN,
        account: "",
        last_modified: "",
    } as DIDRulesViewModel
}