import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";
import { Subscription } from "../entity/rucio";

export interface GetSubscriptionRequest {
    account: string;
    name: string;
}

export interface GetSubscriptionResponse extends Subscription, BaseResponseModel {}

export interface GetSubscriptionError extends BaseErrorResponseModel {
    error: 'SUBSCRIPTION_NOT_FOUND' | 'UNKNOWN_ERROR' | 'INVALID_REQUEST' | 'INVALID_AUTH';
}
