'use client';
import { PageSubscription as PageSubscriptionStory } from "@/component-library/Pages/Subscriptions/PageSubscription";
import { SubscriptionViewModel } from "@/lib/infrastructure/data/view-model/subscriptions";
import { fixtureSubscriptionViewModel } from "test/fixtures/table-fixtures";
export default function PageSubscription({ params }: { params: { account: string, name: string }}) {
    return (
        <PageSubscriptionStory
            subscriptionViewModel={fixtureSubscriptionViewModel()}
            editFilter={(s: string) => {}}
            editReplicationRules={(r: string) => {}}
        />
    )
}
                