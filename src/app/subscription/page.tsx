'use client';
import { createSubscriptionMeta } from "test/fixtures/table-fixtures";
import { PageSubscription as PageSubscriptionStory } from "@/component-library/components/Pages/Subscriptions/PageSubscription";
import { Code } from "@/component-library/components/Text/Content/Code";

export default function PageSubscription() {
    return (
        <PageSubscriptionStory
            subscriptionMeta={createSubscriptionMeta()}
            editFilter={(filter: string) => { }}
            editReplicationRules={(rules: string) => { }}
        />
    )
}
