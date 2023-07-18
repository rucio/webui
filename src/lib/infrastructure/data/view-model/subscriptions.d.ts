import { Subscription, SubscriptionReplicationRule } from "@/lib/core/entity/rucio";
import { BaseViewModel } from "@/lib/sdk/view-models";

export interface SubscriptionViewModel extends BaseViewModel, Omit<Subscription, 'replication_rules'> {
    replication_rules: string
}