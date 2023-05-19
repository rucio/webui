export type RSEDTO = {
    id: string;
    name: string;
}

export type DIDType = "Dataset" | "Container" | "Collection" | "File";
export type DIDAvailability = "Available" | "Deleted" | "Lost";

// results of web::flaskapi:v1::rses::RSEAccountUsageLimit::get
export type RSEAccountUsageLimitDTO = {
    rse_id: string;
    rse: string;
    account: string;
    used_files: number;
    used_bytes: number;
    quota_bytes: number;
}

// results of core::did::list_dids (with `long` option)
export type DIDDTO = {
    name: string;
    scope: string;
    did_type: DIDType;
    bytes: number;
    length: number;
}

// copied from deployed rucio UI
// these key value pairs are fixed
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
