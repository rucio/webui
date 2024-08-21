import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from '@/lib/sdk/primary-ports';
import {
    ListSubscriptionRuleStatesResponse,
    ListSubscriptionRuleStatesRequest,
    ListSubscriptionRuleStatesError,
} from '@/lib/core/usecase-models/list-subscription-rule-states-usecase-models';
import { SubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
/**
 * @interface ListSubscriptionRuleStatesInputPort that abstracts the usecase.
 */
export interface ListSubscriptionRuleStatesInputPort extends BaseAuthenticatedInputPort<ListSubscriptionRuleStatesRequest> {}

/**
 * @interface ListSubscriptionRuleStatesOutputPort that abtrsacts the presenter
 */
export interface ListSubscriptionRuleStatesOutputPort
    extends BaseStreamingOutputPort<ListSubscriptionRuleStatesResponse, ListSubscriptionRuleStatesError, SubscriptionRuleStatesViewModel> {}
