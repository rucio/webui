import { BaseDTO, BaseStreamableDTO } from "@/lib/sdk/dto";
import { Subscription } from "../entity/rucio";


/**
 * The Data Transfer Object for the ListSubscriptionsEndpoint which contains the stream
 */
export interface ListSubscriptionsDTO extends BaseStreamableDTO {}

/**
 * Data Transfer Object for GET Subscription Endpoint
 */
export interface SubscriptionDTO extends BaseDTO, Subscription {
}