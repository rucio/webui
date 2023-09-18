import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";
import { Subscription } from "../entity/rucio";

export interface GetSubscriptionRequest {
    account: string;
    name: string;
}

export interface GetSubscriptionResponse extends Subscription, BaseResponseModel {}

/**
 * Error Response Model for GET Subscription UseCase
 * @property error - Error Message
 * INVALID_ACCOUNT: The account specified in the request is not same as the account present in the session
 */
export interface GetSubscriptionError extends BaseErrorResponseModel {
    error: 'SUBSCRIPTION_NOT_FOUND' | 'UNKNOWN_ERROR' | 'INVALID_REQUEST' | 'INVALID_AUTH' | 'INVALID_ACCOUNT';
}
