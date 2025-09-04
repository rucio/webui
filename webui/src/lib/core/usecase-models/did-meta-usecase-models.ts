import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { DIDMeta } from '../entity/rucio';

export interface DIDMetaRequest {
    did: string;
    scope: string;
}

export interface DIDMetaResponse extends DIDMeta, BaseResponseModel {}

export interface DIDMetaError extends BaseErrorResponseModel {
    error: 'UNKNOWN_ERROR' | 'INVALID_REQUEST' | 'INVALID_AUTH' | 'INVALID_METADATA';
}
