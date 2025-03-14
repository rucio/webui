import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { DIDLong, DIDType } from '@/lib/core/entity/rucio';

export interface ListDIDsRequest {
    query: string;
    type: DIDType;
}

export interface ListDIDsResponse extends DIDLong, BaseResponseModel {}

export interface ListDIDsError extends BaseErrorResponseModel {
    name: string;
    error: 'Invalid DID Query' | 'Unknown Error' | 'Invalid Request' | string;
}
