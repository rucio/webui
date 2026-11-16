import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { Subscription } from '../entity/rucio';

export interface GetSubscriptionByIdRequest {
    id: string;
}

export interface GetSubscriptionByIdResponse extends Subscription, BaseResponseModel {}

export interface GetSubscriptionByIdError extends BaseErrorResponseModel {
    error: 'SUBSCRIPTION_NOT_FOUND' | 'UNKNOWN_ERROR' | 'INVALID_REQUEST' | 'INVALID_AUTH' | 'INVALID_ID';
}
