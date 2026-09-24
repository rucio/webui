import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { DID, DIDType, DIDFilter } from '@/lib/core/entity/rucio';

export interface ListDIDsRequest {
    query: string;
    type: DIDType;
    filters: DIDFilter[];
}

export type ListDIDsRecordKind = 'did' | 'progress' | 'notice';
export type ListDIDsProgressState = 'searching' | 'found' | 'empty';
export type ListDIDsNoticeCode = 'refine-wildcard' | 'no-results';

export interface ListDIDsProgress {
    types: DIDType[];
    state: ListDIDsProgressState;
}

export interface ListDIDsNotice {
    code: ListDIDsNoticeCode;
    message: string;
}

export interface ListDIDsResponse extends DID, BaseResponseModel {
    bytes: number;
    length: number;
    open: boolean;
    /** Absent means 'did'. Only ALL requests emit the other kinds. */
    kind?: ListDIDsRecordKind;
    progress?: ListDIDsProgress;
    notice?: ListDIDsNotice;
}

export interface ListDIDsError extends BaseErrorResponseModel {
    name: string;
    error: 'Invalid DID Query' | 'Unknown Error' | 'Invalid Request' | string;
}
