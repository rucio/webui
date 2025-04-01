import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { DIDShort, DIDType } from '@/lib/core/entity/rucio';

export interface ListDIDsRequest {
    query: string;
    type: DIDType;
}

export interface ListDIDsResponse extends DIDShort, BaseResponseModel {}

export interface ListDIDsError extends BaseErrorResponseModel {
    name: string;
    error: 'Invalid DID Query' | 'Unknown Error' | 'Invalid Request' | string;
}
