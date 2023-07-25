import { SubscriptionViewModel } from "@/lib/infrastructure/data/view-model/subscriptions";
import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";
import { Subscription } from "../entity/rucio";

/**
 * Represents the request to list subscriptions.
 * @property account - The account to list subscriptions for.
 * @property sessionAccount - The account in the current session.
 */
export interface ListSubscriptionsRequest {
    account: string;
    sessionAccount: string;
}

export interface ListSubscriptionsResponse extends Subscription, BaseResponseModel {}

/**
 * Error Response Model for List Subscription UseCase
 * @property error - Error Message contains error from gateway unless the following type of error occurs:
 * INVALID_ACCOUNT: The account specified in the request is not same as the account present in the session
 */
export interface ListSubscriptionsError extends BaseErrorResponseModel {
    error: 'INVALID_ACCOUNT' | string
}
