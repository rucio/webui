import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { DID, DIDType, DIDFilter } from '@/lib/core/entity/rucio';

export interface ListDIDsRequest {
    query: string;
    type: DIDType;
    filters: DIDFilter[];
}

export interface ListDIDsResponse extends DID, BaseResponseModel {
    bytes: number;
    length: number;
    open: boolean;
}

export interface ListDIDsError extends BaseErrorResponseModel {
    name: string;
    error: 'Invalid DID Query' | 'Unknown Error' | 'Invalid Request' | string;
}
