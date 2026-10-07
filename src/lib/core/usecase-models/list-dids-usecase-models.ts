import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { DID, DIDType, DIDFilter } from '@/lib/core/entity/rucio';

export interface ListDIDsRequest {
    query: string;
    type: DIDType;
    filters: DIDFilter[];
}

export type ListDIDsRecordKind = 'did' | 'progress' | 'notice';
export type ListDIDsProgressState = 'searching' | 'found' | 'empty';
export type ListDIDsNoticeCode = 'refine-wildcard' | 'no-results' | 'files-skipped';

export interface ListDIDsProgress {
    types: DIDType[];
    state: ListDIDsProgressState;
}

export interface ListDIDsNotice {
    code: ListDIDsNoticeCode;
    message: string;
}

/**
 * The envelope an ALL search adds to the stream so progress and notices can travel
 * alongside the DIDs. Shared by the response model and the view model so the two
 * cannot drift apart.
 */
export interface ListDIDsRecordEnvelope {
    /** Absent means 'did'. Only ALL searches emit the other kinds. */
    kind?: ListDIDsRecordKind;
    progress?: ListDIDsProgress;
    notice?: ListDIDsNotice;
}

export interface ListDIDsResponse extends DID, BaseResponseModel, ListDIDsRecordEnvelope {
    bytes: number;
    length: number;
    open: boolean;
}

export interface ListDIDsError extends BaseErrorResponseModel {
    name: string;
    error: 'Invalid DID Query' | 'Unknown Error' | 'Invalid Request' | string;
}
