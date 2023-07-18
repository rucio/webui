import { BaseAuthenticatedInputPort, BaseOutputPort } from "@/lib/sdk/primary-ports";
import { GetSubscriptionError, GetSubscriptionRequest, GetSubscriptionResponse } from "../../usecase-models/get-subscription-usecase-models";

/**
 * @interface GetSubscriptionInputPort representing the GetSubscription usecase.
 */
export interface GetSubscriptionInputPort extends BaseAuthenticatedInputPort<GetSubscriptionRequest> {}

/**
 * @interface GetSubscriptionOutputPort representing the GetSubscription presenter.
 */
export interface GetSubscriptionOutputPort extends BaseOutputPort<GetSubscriptionResponse, GetSubscriptionError> {}
