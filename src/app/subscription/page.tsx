'use client';
import { createSubscriptionMeta } from "test/fixtures/table-fixtures";
import { PageSubscription as PageSubscriptionStory } from "@/component-library/Pages/Subscriptions/PageSubscription";
import { Code } from "@/component-library/Text/Content/Code";

export default function PageSubscription() {
    return (
        <PageSubscriptionStory
            subscriptionViewModel={createSubscriptionMeta()}
            editFilter={(filter: string) => { }}
            editReplicationRules={(rules: string) => { }}
        />
    )
}
