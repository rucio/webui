import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/common/base-components/usecase-models";
import { DID, DIDType } from "@/lib/core/entity/rucio";
import { AuthenticatedUseCaseRequest, AuthenticatedUseCaseResponse } from "../authenticated-use-case-models";

export interface ListDIDsRequest extends AuthenticatedUseCaseRequest {
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
