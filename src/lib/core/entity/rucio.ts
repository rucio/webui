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