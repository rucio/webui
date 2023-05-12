import { ReplicaState } from "@/lib/core/entity/rucio"
import { RuleState } from "@/lib/core/entity/rucio"

export type FilereplicaStateD = {
    scope: string,
    name: string,
    Available: number,
    Unavailable: number,
    Copying: number,
    Being_Deleted: number,
    Bad: number,
    Temporary_Unavailable: number,
}

export type FilereplicaState = {
    rse: string
    state: ReplicaState
}

export type DIDParents = {
    name: string;
    scope: string;
    did_type: DIDType;
}

// Contents of a container
export type DIDContents = {
    name: string;
    scope: string;
    did_type: DIDType;
}

// these are general key-value pairs including the metadata
export type DIDKeyValuePairs = { key: string; value: string | number | boolean | Date | null }

export type DIDRules = {
    id: string;
    name: string;
    state: RuleState;
    account: string;
    subscription: {name: string, account: string}; // name and account together are unique for a subscription
    last_modified: Date;
}