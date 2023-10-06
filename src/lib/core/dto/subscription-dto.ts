import { BaseDTO, BaseStreamableDTO } from "@/lib/sdk/dto";
import { RuleState, Subscription, SubscriptionRuleStates } from "../entity/rucio";


/**
 * The Data Transfer Object for the ListSubscriptionsEndpoint which contains the stream
 */
export interface ListSubscriptionsDTO extends BaseStreamableDTO {}

/**
 * Data Transfer Object for GET Subscription Endpoint
 */
export interface SubscriptionDTO extends BaseDTO, Subscription {
}

/**
 * Data Transfer Object for streamed data for list Subscription Rule States Endpoint
 */
export interface SubscriptionRuleStateDTO extends BaseDTO {
    account: string,
    subscriptionName: string,
    state: RuleState,
    count: number,
}