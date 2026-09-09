import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';

export interface ListOpenDataDIDsRequest {
    limit?: number;
    offset?: number;
    state?: string;
}

export interface OpenDataDIDListItem {
    scope: string;
    name: string;
    state?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ListOpenDataDIDsResponse extends BaseResponseModel {
    total: number;
    offset: number;
    dids: OpenDataDIDListItem[];
}

export interface ListOpenDataDIDsError extends BaseErrorResponseModel {
    error: 'UNKNOWN_ERROR' | 'INVALID_REQUEST' | 'INVALID_AUTH' | 'NOT_FOUND';
}
