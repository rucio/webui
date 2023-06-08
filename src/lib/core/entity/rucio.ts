/**
 * Entity models for Rucio. Please keep the type definitions sorted in alphabetical order.
 */

// results of core::did::list_dids (with `long` option)
export type DID = {
    name: string;
    scope: string;
    did_type: DIDType;
}

export type DIDLong = DID & {
    bytes: number;
    length: number;
}

export enum DIDAvailability {
    Available = "Available",
    Deleted = "Deleted",
    Lost = "Lost",
}


// copied from deployed rucio UI
export type DIDMeta = {
    name: string
    scope: string
    account: string
    did_type: DIDType
    created_at: Date
    updated_at: Date
    availability: DIDAvailability // Lost/Deleted/Available
    obsolete: boolean
    hidden: boolean
    suppressed: boolean
    purge_replicas: boolean
    monotonic: boolean
    // only for collections
    is_open: boolean | null
    // only for files
    adler32: string | null
    md5: string | null
    guid: string | null
    filesize: number | null
}

export enum DIDType {
    DATASET = "DATASET",
    CONTAINER = "CONTAINER",
    FILE = "FILE",
    ALL = "ALL",
    UNKNOWN = "UNKNOWN"
}

// results of web::flaskapi:v1::rses::RSEAccountUsageLimit::get
export type RSEAccountUsageLimit = {
    rse_id: string;
    rse: string;
    account: string;
    used_files: number;
    used_bytes: number;
    quota_bytes: number;
}

// copied from deployed rucio UI
export type RuleMeta = {
    account: string
    activity: string // VO-specific enums, just show string here.
    copies: number
    created_at: Date
    did_type: DIDType
    expires_at: Date
    grouping: DIDType
    id: string
    ignore_account_limit: boolean
    ignore_availability: boolean
    locked: boolean
    locks_ok_cnt: number
    locks_replicating_cnt: number
    locks_stuck_cnt: number
    name: string
    notification: RuleNotification
    priority: number
    purge_replicas: boolean
    rse_expression: string
    scope: string
    split_container: boolean
    state: RuleState
    updated_at: Date
}

export type SubscriptionMeta = {
    account: string
    comments: string
    created_at: Date
    id: string
    last_processed: Date
    lifetime: Date
    name: string
    policyid: number
    retroactive: boolean
    state: SubscriptionState
    updated_at: Date
    // more difficult datatypes, cast as string for now:
    filter: string
    replication_rules: string
}

export type SubscriptionRuleStates = {
    name: string
    state_ok: number
    state_replicating: number
    state_stuck: number
    state_suspended: number
}

/*
================================================================================
========================= ENUMS and DISCRETE TYPES =============================
================================================================================
*/

// rucio.db.sqla.constants::LockState
export enum LockState {
    Replicating = "R",
    OK = "O",
    Stuck = "S",
}

// rucio.db.sqla.constants::RuleNotification
export enum RuleNotification {
    Yes = "Y", // notify when the rules state becomes OK
    No = "N", // no notification
    Close = "C", // notify when the rules state becomes OK *and* the DID is closed -> least verbose except for "no"
    Progress = "P", // notify for each chang
}

export enum DIDType {
    Dataset = "Dataset",
    Container = "Container",
    Collection = "Collection",
    File = "File",
}

export type RSE = {
    id: string;
    name: string;
    city: string,
    country: string,
    continent: string,
    latitude: number,
    longitude: number,
    rse_type: string,
    volatile: boolean,
}

// rucio.db.sqla.constants::ReplicaState
export enum ReplicaState {
    Available = "Available",
    Unavailable = "Unavailable",
    Copying = "Copying",
    Being_Deleted = "Being_Deleted",
    Bad = "Bad",
    Temporary_Unavailable = "Temporary_Unavailable",
}

// rucio.db.sqla.constants::RuleState
// R/O/S/U/W/I
export enum RuleState {
    Replicating = "Replicating",
    OK = "OK",
    Stuck = "Stuck",
    Suspended = "Suspended",
    Waiting_Approval = "Waiting_Approval",
    Inject = "Inject",
}

export enum SubscriptionState {
    Active = "A",
    Inactive = "I",
    New = "N",
    Updated = "U",
    Broken = "B",
}

// octal representation of the blockstate
// read/write/delete
export type RSEBlockState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;