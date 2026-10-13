export interface OpenDataDIDFileDTO {
    scope: string;
    name: string;
    download_urls: string[];
}

export interface OpenDataDIDListItemDTO {
    scope: string;
    name: string;
    state?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ListOpenDataDIDsDTO {
    status: 'success' | 'error';
    total: number;
    offset: number;
    dids: OpenDataDIDListItemDTO[];

    errorName?: string;
    errorType?: string;
    errorCode?: number;
    errorMessage?: string;
}

export interface OpenDataDIDDTO {
    status: 'success' | 'error';

    scope: string;
    name: string;

    state?: string;
    doi?: string | null;
    record_id?: number | null;
    files: OpenDataDIDFileDTO[];

    meta: Record<string, unknown>;

    errorName?: string;
    errorType?: string;
    errorCode?: number;
    errorMessage?: string;
}
