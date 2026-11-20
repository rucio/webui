import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { Subscription } from '../entity/rucio';

/**
 * @interface GetSubscriptionByIdRequest represents request for get_subscription_by_id usecase.
 */
export interface GetSubscriptionByIdRequest {
    id: string;
}

/**
 * @interface GetSubscriptionByIdResponse represents response for get_subscription_by_id usecase.
 */
export interface GetSubscriptionByIdResponse extends Subscription, BaseResponseModel {}

/**
 * @interface GetSubscriptionByIdError represents error for get_subscription_by_id usecas.
 */
export interface GetSubscriptionByIdError extends BaseErrorResponseModel {
    error: 'SUBSCRIPTION_NOT_FOUND' | 'UNKNOWN_ERROR' | 'INVALID_REQUEST' | 'INVALID_AUTH' | 'INVALID_ID';
}
