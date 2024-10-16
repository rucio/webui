import { BaseViewModel } from '@/lib/sdk/view-models';

export type DateISO = string;

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
    suspendedAt?: DateISO;
};

// Sent to certain endpoints
export type DIDShort = {
    scope: string;
    name: string;
};

// results of core::did::list_dids (with `long` option)
export type DID = DIDShort & {
    did_type: DIDType;
};

export type DIDLong = DID & {
    bytes: number;
    length: number;
};

export enum DIDAvailability {
    AVAILABLE = 'Available',
    DELETED = 'Deleted',
    LOST = 'Lost',
    UNKNOWN = 'Unknown',
}

export type DIDDatasetReplicas = {
    rse: string;
    rseblocked: RSEBlockState;
    availability: boolean;
    available_files: number;
    available_bytes: number;
    creation_date: DateISO;
    last_accessed: DateISO;
};

// these are general key-value pairs including the metadata
export type DIDKeyValuePair = { key: string; value: string | number | boolean | null };
export type DIDKeyValuePairsData = {
    data: DIDKeyValuePair[];
};

// copied from deployed rucio UI
export type DIDMeta = {
    name: string;
    scope: string;
    account: string;
    did_type: DIDType;
    created_at: DateISO;
    updated_at: DateISO;
    availability: DIDAvailability; // Lost/Deleted/Available
    obsolete: boolean;
    hidden: boolean;
    suppressed: boolean;
    purge_replicas: boolean;
    monotonic: boolean;
    // only for collections
    is_open: boolean | null;
    // only for files
    adler32: string | null;
    md5: string | null;
    guid: string | null;
    bytes: number | null;
};

export type DIDRules = {
    id: string;
    name: string;
    state: RuleState;
    account: string;
    subscription?: { name: string; account: string }; // name and account together are unique for a subscription
    last_modified: DateISO;
};

// File replica states for file DIDs
export type FileReplicaState = {
    rse: string;
    state: ReplicaState;
};

// File replica states for dataset DIDs
// stores summary information on the file replica states of the files within
// a dataset DID: how many files are in each state
// currently not in use since we only display scopenames
export type FileReplicaStateD = {
    scope: string;
    name: string;
    available: number;
    unavailable: number;
    copying: number;
    being_deleted: number;
    bad: number;
    temporary_unavailable: number;
};

// results of web::flaskapi:v1::rses::RSEAccountUsageLimit::get
export type RSEAccountUsage = {
    rse_id: string;
    rse: string;
    account: string;
    files: number;
    used_bytes: number;
    bytes_limit: number;
};

// TODO: complete with all the fields
// copied from deployed rucio UI
export type RuleMeta = {
    account: string;
    activity: string; // VO-specific enums, just show string here.
    copies: number;
    created_at: DateISO;
    did_type: DIDType;
    expires_at: DateISO | null;
    grouping: RuleGrouping;
    id: string;
    ignore_account_limit: boolean;
    ignore_availability: boolean;
    locked: boolean;
    locks_ok_cnt: number;
    locks_replicating_cnt: number;
    locks_stuck_cnt: number;
    name: string;
    notification: RuleNotification;
    priority: number;
    purge_replicas: boolean;
    rse_expression: string;
    scope: string;
    split_container: boolean;
    state: RuleState;
    updated_at: DateISO;
};

export type RulePageLockEntry = {
    scope: string;
    name: string;
    rse: string;
    state: LockState;
    ddm_link: string;
    fts_link: string;
};

export type Rule = {
    id: string;
    scope: string;
    name: string;
    account: string;
    rse_expression: string;
    created_at: DateISO;
    // Seconds
    remaining_lifetime: number;
    state: RuleState;
    locks_ok_cnt: number;
    locks_replicating_cnt: number;
    locks_stuck_cnt: number;
};

// TODO: add explanatory comments
export type RuleCreationParameters = {
    dids: DIDShort[];
    copies: number;
    rse_expression: string;
    account: string;
    grouping?: 'ALL' | 'DATASET' | 'NONE';
    weight?: number;
    // In seconds
    lifetime?: number;
    locked?: boolean;
    subscription_id?: string;
    source_replica_expression?: string;
    activity?: string;
    notify?: 'Y' | 'N' | 'C' | 'P';
    purge_replicas?: boolean;
    ignore_availability?: boolean;
    comments?: string;
    ask_approval?: boolean;
    asynchronous?: boolean;
    priority?: number;
    split_container?: boolean;
    meta?: string;
};

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
    account: string;
    created_at: DateISO;
    id: string;
    last_processed: DateISO;
    lifetime: DateISO;
    name: string;
    policyid: number;
    retroactive: boolean;
    state: SubscriptionState;
    updated_at: DateISO;
    // more difficult datatypes, cast as string for now:
    filter: string;
    replication_rules: SubscriptionReplicationRule[];
};

export type SubscriptionRuleStates = {
    name: string;
    state_ok: number;
    state_replicating: number;
    state_stuck: number;
    state_suspended: number;
    state_waiting_approval: number;
    state_inject: number;
};

export type RSE = {
    id: string;
    name: string;
    rse_type: RSEType;
    volatile: boolean;
    deterministic: boolean;
    staging_area: boolean;
};

export type RSEProtocol = {
    rseid: string;
    scheme: string;
    hostname: string;
    port: number;
    prefix: string;
    impl: string;
    priorities_lan: {
        read: number;
        write: number;
        delete: number;
    };
    priorities_wan: {
        read: number;
        write: number;
        delete: number;
        tpc?: number; // TODO: what is this?
        tpcwrite: number;
        tpcread: number;
    };
    updated_at?: DateISO; // TODO: rucio does not provide this
    created_at?: DateISO; // TODO: rucio does not provide this
};

export type RSEAttribute = {
    key: string;
    value: string | DateISO | number | boolean | null;
};

/*
================================================================================
========================= ENUMS and DISCRETE TYPES =============================
================================================================================
*/

// rucio.db.sqla.constants::LockState
export enum LockState {
    REPLICATING = 'R',
    OK = 'O',
    STUCK = 'S',
    UNKNOWN = 'U',
}

export enum RuleGrouping {
    ALL = 'A',
    DATASET = 'D',
    NONE = 'N',
}

// rucio.db.sqla.constants::RuleNotification
export enum RuleNotification {
    Yes = 'Y', // notify when the rules state becomes OK
    No = 'N', // no notification
    Close = 'C', // notify when the rules state becomes OK *and* the DID is closed -> least verbose except for "no"
    Progress = 'P', // notify for each chang
}

export enum DIDType {
    DATASET = 'Dataset',
    CONTAINER = 'Container',
    COLLECTION = 'Collection',
    FILE = 'File',
    ALL = 'All',
    UNKNOWN = 'Unknown',
    DERIVED = 'Derived',
}

// replace this!
export interface RSEOld extends BaseViewModel {
    status: 'success' | 'error';
    id: string;
    name: string;
    city: string;
    country: string;
    continent: string;
    latitude: number;
    longitude: number;
    rse_type: string;
    volatile: boolean;
}

export enum RSEType {
    DISK = 'DISK',
    TAPE = 'TAPE',
    UNKNOWN = 'UNKNOWN',
}

// rucio.db.sqla.constants::ReplicaState
export enum ReplicaState {
    AVAILABLE = 'Available',
    UNAVAILABLE = 'Unavailable',
    COPYING = 'Copying',
    BEING_DELETED = 'Being_Deleted',
    BAD = 'Bad',
    TEMPORARY_UNAVAILABLE = 'Temporary_Unavailable',
    UNKNOWN = 'Unknown',
}

// rucio.db.sqla.constants::RuleState
// R/O/S/U/W/I
export enum RuleState {
    REPLICATING = 'Replicating',
    OK = 'OK',
    STUCK = 'Stuck',
    SUSPENDED = 'Suspended',
    WAITING_APPROVAL = 'Waiting_Approval',
    INJECT = 'Inject',
    UNKNOWN = 'Unknown',
}

export enum SubscriptionState {
    ACTIVE = 'A',
    INACTIVE = 'I',
    NEW = 'N',
    UPDATED = 'U',
    BROKEN = 'B',
    UNKNOWN = 'UNKNOWN',
}

// octal representation of the blockstate
// read/write/delete
export type RSEBlockState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
