import { DIDKeyValuePair, DIDKeyValuePairsData } from "@/lib/infrastructure/data/view-model/page-did";
import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";

export interface DIDKeyValuePairsDataRequest {
    did: string;
    scope: string;
}

export interface DIDKeyValuePairsDataResponse extends DIDKeyValuePairsData, BaseResponseModel { }

export interface DIDKeyValuePairsDataError extends BaseErrorResponseModel {
    error: 'UNKNOWN_ERROR' | 'INVALID_REQUEST' | 'INVALID_AUTH' | 'INVALID_METADATA';
}
