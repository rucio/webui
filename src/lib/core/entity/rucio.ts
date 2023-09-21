import { BaseViewModel } from "@/lib/sdk/view-models";

export type DateISO = string

/**
 * Entity models for Rucio. Please keep the type definitions sorted in alphabetical order.
 */

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    DELETED = 'DELETED',
    UNKNOWN = 'UNKNOWN',
}

export enum AccountType {
    USER = 'USER',
    GROUP = 'GROUP',
    SERVICE = 'SERVICE',
    UNKNOWN = 'UNKNOWN',
}

export type AccountInfo = {
    account: string;
    accountType: AccountType;
    accountStatus: AccountStatus;
    email: string;
    createdAt: DateISO;
    updatedAt: DateISO;
    deletedAt?: DateISO;
    suspendedAt?:  DateISO;
};

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
export type DIDKeyValuePair = { key: string; value: string | number | boolean | null }
export type DIDKeyValuePairsData = {
    data: DIDKeyValuePair[]
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

export type DIDRules = {
    id: string;
    name: string;
    state: RuleState;
    account: string;
    subscription?: {name: string, account: string}; // name and account together are unique for a subscription
    last_modified: DateISO;
}

// File replica states for file DIDs
export type FileReplicaState = {
    rse: string
    state: ReplicaState
}

// File replica states for dataset DIDs
// stores summary information on the file replica states of the files within
// a dataset DID: how many files are in each state
// currently not in use since we only display scopenames
export type FileReplicaStateD = {
    scope: string,
    name: string,
    available: number,
    unavailable: number,
    copying: number,
    being_deleted: number,
    bad: number,
    temporary_unavailable: number,
}

// results of web::flaskapi:v1::rses::RSEAccountUsageLimit::get
export type RSEAccountUsage = {
    rse_id: string;
    rse: string;
    account: string;
    files: number;
    used_bytes: number;
    bytes_limit: number;
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

export type RulePageLockEntry = {
    scope: string;
    name: string;
    rse: string;
    state: LockState;
    ddm_link: string;
    fts_link: string;
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
    state_waiting_approval: number
    state_inject: number
}

export type RSE = {
    id: string;
    name: string;
    rse_type: RSEType;
    volatile: boolean;
    deterministic: boolean;
    staging_area: boolean;
}

export type RSEProtocol = {
    rseid: string,
    scheme: string,
    hostname: string,
    port: number,
    prefix: string,
    impl: string,
    priorities_lan: {
        read: number,
        write: number,
        delete: number
    },
    priorities_wan: {
        read: number,
        write: number,
        delete: number,
        tpc?: number, // TODO: what is this?
        tpcwrite: number,
        tpcread: number,
    },
    updated_at?: DateISO, // TODO: rucio does not provide this
    created_at?: DateISO, // TODO: rucio does not provide this
}

export type RSEAttribute = {
    key: string,
    value: string| DateISO | number | boolean | null,
}

/**
 * Represents a transfer request in Rucio.
 */
export type Request = {
    id: string,
    request_type: RequestType,
    scope: string,
    name: string,
    did_type: DIDType,
    dest_rse_id: string,
    source_rse_id: string | null,
    attributes: string,
    state: RequestState,
    activity: string,
    bytes: number,
    submitted_at?: DateISO,
    started_at?: DateISO,
    transferred_at?: DateISO,
    submitter_id?: number,
    estimated_started_at?: DateISO,
    estimated_transferred_at?: DateISO,
    account: string,
    requested_at: DateISO,
    priority: number,
    transfertool: string,
}

/*
================================================================================
========================= ENUMS and DISCRETE TYPES =============================
================================================================================
*/

// rucio.db.sqla.constants::LockState
export enum LockState {
    REPLICATING = "R",
    OK = "O",
    STUCK = "S",
    UNKNOWN = "U",
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
    DERIVED = "Derived",
}

// replace this!
export interface RSEOld extends BaseViewModel {
    status: 'success' | 'error'
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
    DISK = "DISK",
    TAPE = "TAPE",
    UNKNOWN = "UNKNOWN",
}

// rucio.db.sqla.constants::ReplicaState
export enum ReplicaState {
    AVAILABLE = "Available",
    UNAVAILABLE = "Unavailable",
    COPYING = "Copying",
    BEING_DELETED = "Being_Deleted",
    BAD = "Bad",
    TEMPORARY_UNAVAILABLE = "Temporary_Unavailable",
    UNKNOWN = "Unknown",
}

// rucio.db.sqla.constants::RuleState
// R/O/S/U/W/I
export enum RuleState {
    REPLICATING = "Replicating",
    OK = "OK",
    STUCK = "Stuck",
    SUSPENDED = "Suspended",
    WAITING_APPROVAL = "Waiting_Approval",
    INJECT = "Inject",
    UNKNOWN = "Unknown",
}

export enum SubscriptionState {
    ACTIVE = "A",
    INACTIVE = "I",
    NEW = "N",
    UPDATED = "U",
    BROKEN = "B",
    UNKNOWN = "UNKNOWN",
}

// rucio.db.sqla.constants::RequestType
// T/U/D/I/O
export enum RequestType {
    TRANSFER = "T",
    UPLOAD = "U",
    DOWNLOAD = "D",
    STAGEIN = "I",
    STAGEOUT = "O",
}

// rucio.db.sqla.constants::RequestState
// Q/G/S/F/D/L/N/O/A/M/U/W/P
export enum RequestState {
    QUEUED = "Q",
    SUBMITTING = "G",
    SUBMITTED = "S",
    FAILED = "F",
    DONE = "D",
    LOST = "L",
    NO_SOURCES = "N",
    ONLY_TAPE_SOURCES = "O",
    SUBMISSION_FAILED = "A",
    MISMATCH_SCHEME = "M",
    SUSPEND = "U",
    WAITING = "W",
    PREPARING = "P",
}

// octal representation of the blockstate
// read/write/delete
export type RSEBlockState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
