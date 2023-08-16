'use client';

import { useEffect, useState } from "react";
import { PageSubscription as PageSubscriptionStory } from "@/component-library/Pages/Subscriptions/PageSubscription";
import { SubscriptionViewModel } from "@/lib/infrastructure/data/view-model/subscriptions";
import { fixtureSubscriptionViewModel } from "test/fixtures/table-fixtures";
import { HTTPRequest, prepareRequestArgs } from "@/lib/sdk/http";
import { Loading } from "@/component-library/Pages/Helpers/Loading";

export default function PageSubscription({ params }: { params: { account: string, name: string } }) {
    const [subscriptionViewModel, setSubscriptionViewModel] = useState<SubscriptionViewModel>({status: "pending"} as SubscriptionViewModel)
    useEffect(() => {
        subscriptionQuery(params.account, params.name).then(setSubscriptionViewModel)
    }, [])
    async function subscriptionQuery(account: string, name: string): Promise<SubscriptionViewModel> {
        const req: HTTPRequest = {
            method: "GET",
            url: new URL('http://localhost:3000/api/subscription'),
            params: {
                "account": account,
                "name": name
            },
            headers: new Headers({
                'Content-Type': 'application/json',
            } as HeadersInit)
        }

        const { url, requestArgs } = prepareRequestArgs(req)
        const res = await fetch(url, {
            method: "GET",
            headers: new Headers({
                'Content-Type': 'application/json',
            } as HeadersInit)
        })

        return await res.json()
    }
    if (subscriptionViewModel.status === 'success') {
        return (
            <PageSubscriptionStory
                subscriptionViewModel={subscriptionViewModel}
                editFilter={(s: string) => { }}
                editReplicationRules={(r: string) => { }}
            />
        )
    } else {
        return (
            <Loading
                title="View Subscription"
                subtitle={`For subscription ${params.name}`}
            />
        )
    }
}
