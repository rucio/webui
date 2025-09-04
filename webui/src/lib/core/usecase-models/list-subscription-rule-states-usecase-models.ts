import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { SubscriptionRuleStates } from '../entity/rucio';
/**
 * @interface ListSubscriptionRuleStatesRequest represents the RequestModel for list_subscription_rule_states usecase
 */
export interface ListSubscriptionRuleStatesRequest {
    account: string;
}

/**
 * @interface ListSubscriptionRuleStatesResponse represents the ResponseModel for list_subscription_rule_states usecase
 */
export interface ListSubscriptionRuleStatesResponse extends SubscriptionRuleStates, BaseResponseModel {}

/**
 * @interface ListSubscriptionRuleStatesError represents the ErrorModel for list_subscription_rule_states usecase
 */
export interface ListSubscriptionRuleStatesError extends BaseErrorResponseModel {}
