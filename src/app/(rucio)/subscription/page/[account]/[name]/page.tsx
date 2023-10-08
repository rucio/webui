'use client';

import { useEffect, useState } from "react";
import { PageSubscription as PageSubscriptionStory } from "@/component-library/Pages/Subscriptions/PageSubscription";
import { SubscriptionViewModel } from "@/lib/infrastructure/data/view-model/subscriptions";
import { fixtureSubscriptionViewModel } from "test/fixtures/table-fixtures";
import { HTTPRequest, prepareRequestArgs } from "@/lib/sdk/http";
import { Loading } from "@/component-library/Pages/Helpers/Loading";

async function updateSubscription(
    id: string,
    filter: string,
    replicationRules: string
) {
    const req: HTTPRequest = {
        method: "PUT",
        url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/mock-update-subscription`),
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            subscriptionID: id,
        },
        body: {
            filter: filter,
            replicationRules: replicationRules,
        },
    }
    const { url, requestArgs } = prepareRequestArgs(req)
    const res = await fetch(url, {
        method: "PUT",
        headers: new Headers({
            'Content-Type': 'application/json',
        } as HeadersInit),
        body: JSON.stringify(requestArgs.body) as BodyInit,
    })

    return await res.json()
}

export default function PageSubscription({ params }: { params: { account: string, name: string } }) {
    const [subscriptionViewModel, setSubscriptionViewModel] = useState<SubscriptionViewModel>({status: "pending"} as SubscriptionViewModel)
    useEffect(() => {
        subscriptionQuery(params.account, params.name).then(setSubscriptionViewModel)
    }, [])
    async function subscriptionQuery(account: string, name: string): Promise<SubscriptionViewModel> {
        const req: HTTPRequest = {
            method: "GET",
            url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/get-subscription`),
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
                editFilter={(s: string) => {
                    updateSubscription(
                        subscriptionViewModel.id,
                        s,
                        subscriptionViewModel.replication_rules
                    ).then(setSubscriptionViewModel)
                }}
                editReplicationRules={(r: string) => {
                    updateSubscription(
                        subscriptionViewModel.id,
                        subscriptionViewModel.filter,
                        r
                    ).then(setSubscriptionViewModel)
                }}
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
