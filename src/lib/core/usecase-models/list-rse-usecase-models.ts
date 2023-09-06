import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";
import { RSE } from "../entity/rucio";

export interface ListRSEsRequest {
    rseExpression: string;
}

export interface ListRSEsResponse extends RSE, BaseResponseModel {}

export interface ListRSEsError extends BaseErrorResponseModel {
    name: string;
    error: 'Invalid RSE ExpressOon' | 'Unknown Error' | 'Invalid Request' | string;
}