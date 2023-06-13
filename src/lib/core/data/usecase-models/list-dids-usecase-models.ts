import { DID, DIDType } from "@/lib/core/entity/rucio";
import { AuthenticatedUseCaseRequest, AuthenticatedUseCaseResponse } from "../authenticated-use-case-models";

export interface ListDIDsRequest extends AuthenticatedUseCaseRequest {
    query: string;
    type: DIDType;
}

export interface ListDIDsResponse extends DID {
    bytes: number;
    length: number;
}

export type ListDIDsError = {
    error: 'Invalid DID Query' | 'Unknown Error' | 'Invalid Request' ;
    message: string | undefined | unknown;
}
