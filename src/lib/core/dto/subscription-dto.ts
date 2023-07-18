import { BaseDTO } from "@/lib/sdk/dto";
import { Subscription } from "../entity/rucio";

/**
 * Data Transfer Object for GET Subscription Endpoint
 */
export interface SubscriptionDTO extends BaseDTO, Subscription {
}