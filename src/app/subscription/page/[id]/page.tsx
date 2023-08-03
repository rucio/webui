'use client';
import { createSubscriptionMeta } from "test/fixtures/table-fixtures";
import { PageSubscription as PageSubscriptionStory } from "@/component-library/Pages/Subscriptions/PageSubscription";
import { SubscriptionViewModel } from "@/lib/infrastructure/data/view-model/subscriptions";

export default function PageSubscription({ params }: { params: { id: string }}) {
    return (
        <PageSubscriptionStory
            subscriptionViewModel={{...createSubscriptionMeta(), id: params.id} as SubscriptionViewModel}
            editFilter={(filter: string) => { }}
            editReplicationRules={(rules: string) => { }}
        />
    )
}
