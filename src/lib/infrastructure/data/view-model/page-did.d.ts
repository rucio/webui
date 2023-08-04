import { DateISO, ReplicaState, RSEBlockState } from "@/lib/core/entity/rucio"
import { RuleState } from "@/lib/core/entity/rucio"
import { ObjectFlags } from "typescript"

// File replica states for file DIDs
export type FilereplicaState = {
    rse: string
    state: ReplicaState
}

// File replica states for dataset DIDs
// stores summary information on the file replica states of the files within
// a dataset DID: how many files are in each state
export type FilereplicaStateD = {
    scope: string,
    name: string,
    available: number,
    unavailable: number,
    copying: number,
    being_deleted: number,
    bad: number,
    temporary_unavailable: number,
}

export type DIDDatasetReplicas = {
    rse: string;
    rseblocked: RSEBlockState;
    availability: boolean;
    available_files: number;
    available_bytes: number;
    creation_date: DateISO;
    last_accessed: DateISO;
}

// these are general key-value pairs including the metadata
export type DIDKeyValuePairs = { key: string; value: string | number | boolean | null }

export type DIDRules = {
    id: string;
    name: string;
    state: RuleState;
    account: string;
    subscription: {name: string, account: string}; // name and account together are unique for a subscription
    last_modified: DateISO;
}