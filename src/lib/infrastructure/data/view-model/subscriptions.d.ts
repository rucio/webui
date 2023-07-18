import { Subscription } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";

export interface SubscriptionViewModel extends BaseViewModel, Subscription{
}