export type RSEDTO = {
    id: string;
    name: string;
}

export type DIDType = "Dataset" | "Container" | "Collection" | "File";

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