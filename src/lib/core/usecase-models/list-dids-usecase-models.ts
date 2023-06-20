import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";
import { DID, DIDType } from "@/lib/core/entity/rucio";

export interface ListDIDsRequest {
    query: string;
    type: DIDType;
}

export interface ListDIDsResponse extends DID, BaseResponseModel {
    bytes: number;
    length: number;
}

export interface ListDIDsError extends BaseErrorResponseModel {
    error: 'Invalid DID Query' | 'Unknown Error' | 'Invalid Request' ;
}
