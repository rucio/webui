export type DateISO = string

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
    AVAILABLE = "Available",
    DELETED = "Deleted",
    LOST = "Lost",
    UNKNOWN = "Unknown",
}


// copied from deployed rucio UI
export type DIDMeta = {
    name: string
    scope: string
    account: string
    did_type: DIDType
    created_at: DateISO
    updated_at: DateISO
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
    created_at: DateISO
    did_type: DIDType
    expires_at: DateISO
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
    updated_at: DateISO
}

export type Rule = {
    id: string;
    name: string;
    account: string;
    rse_expression: string;
    created_at: DateISO;
    remaining_lifetime: number;
    state: RuleState;
    locks_ok_cnt: number;
    locks_replicating_cnt: number;
    locks_stuck_cnt: number;
}

/**
 * Represents the replication rule metadata avilable for a rule in a subscription.
 */
export type SubscriptionReplicationRule = {
    activity: string;
    rse_expression: string;
    source_replica_expression?: string;
    copies: string;
    lifetime: number;
    weight: number;
    comments?: string;
};

/**
 * Represents a subscription in Rucio.
 */
export type Subscription = {
    account: string
    created_at: DateISO
    id: string
    last_processed: DateISO
    lifetime: DateISO
    name: string
    policyid: number
    retroactive: boolean
    state: SubscriptionState
    updated_at: DateISO
    // more difficult datatypes, cast as string for now:
    filter: string
    replication_rules: SubscriptionReplicationRule[]
}

export type SubscriptionRuleStates = {
    name: string
    state_ok: number
    state_replicating: number
    state_stuck: number
    state_suspended: number
}

export type RSE = {
    id: string;
    name: string;
    rse_type: RSEType;
    volatile: boolean;
    deterministic: boolean;
    staging_area: boolean;
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
    DATASET = "Dataset",
    CONTAINER = "Container",
    COLLECTION = "Collection",
    FILE = "File",
    ALL = "All",
    UNKNOWN = "Unknown",
}

// replace this!
export type RSEOld = {
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

export enum RSEType {
    Disk = "DISK",
    Tape = "TAPE",
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
    ACTIVE = "A",
    INACTIVE = "I",
    NEW = "N",
    UPDATED = "U",
    BROKEN = "B",
    UNKNOWN = "UNKNOWN",
}

// octal representation of the blockstate
// read/write/delete
export type RSEBlockState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;