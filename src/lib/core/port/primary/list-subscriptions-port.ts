import { SubscriptionViewModel } from "@/lib/infrastructure/data/view-model/subscriptions";
import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from "@/lib/sdk/primary-ports";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { ListSubscriptionsError, ListSubscriptionsRequest, ListSubscriptionsResponse } from "../../usecase-models/list-subscriptions-usecase-models";

/**
 * @interface ListSubscriptionsInputPort represents the ListSubscriptions usecase.
 */
export interface ListSubscriptionsInputPort extends BaseAuthenticatedInputPort<AuthenticatedRequestModel<ListSubscriptionsRequest>> {}

/**
 * @interface ListSubscriptionsOutputPort represents the ListSubscriptions streamable presenter.
 */
export interface ListSubscriptionsOutputPort extends BaseStreamingOutputPort<ListSubscriptionsResponse, ListSubscriptionsError, SubscriptionViewModel> {}