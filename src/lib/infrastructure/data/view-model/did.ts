import {
    DID, DIDLong, DIDMeta, DIDType, ReplicaState, RuleState,   DIDRules, DIDKeyValuePairsData,
    FileReplicaState, FileReplicaStateD, DIDDatasetReplicas
} from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";

export interface DIDViewModel extends DID, BaseViewModel {}
export interface DIDLongViewModel extends DIDLong, BaseViewModel {}

export interface DIDMetaViewModel extends DIDMeta, BaseViewModel {}
export interface DIDKeyValuePairsDataViewModel extends DIDKeyValuePairsData, BaseViewModel {}
export interface DIDRulesViewModel extends DIDRules, BaseViewModel {}
export interface DIDDatasetReplicasViewModel extends DIDDatasetReplicas, BaseViewModel {}
export interface FileReplicaStateViewModel extends FileReplicaState, BaseViewModel {}
export interface FilereplicaStateDViewModel extends FileReplicaStateD, BaseViewModel {}

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

export function generateEmptyDIDViewModel(): DIDViewModel {
    return {
        status: "error",
        name: "",
        scope: "",
        did_type: DIDType.UNKNOWN,
    }
}

export function generateEmptyFilereplicaStateViewModel(): FileReplicaStateViewModel {
    return {
        status: "error",
        rse: "",
        state: ReplicaState.UNKNOWN,
    }
}

export function generateEmptyDIDDatasetReplicasViewModel(): DIDDatasetReplicasViewModel {
    return {
        status: "error",
        rseblocked: 0,
        availability: false,
        available_files: 0,
        available_bytes: 0,
        creation_date: "",
        last_accessed: "",
    } as DIDDatasetReplicasViewModel
}