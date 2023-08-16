'use client';
import { ListSubscription as ListSubscriptionStory } from "@/component-library/Pages/Subscriptions/ListSubscription";
import { Component, useEffect, useState } from "react";
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";
import { SubscriptionRuleStatesViewModel } from "@/lib/infrastructure/data/view-model/subscriptions";

export default function ListSubscription({ params }: { params: { account: string } }) {
    const ComDOM = useComDOM<SubscriptionRuleStatesViewModel>(
        "subscription-rule-states-query",
        [],
        false,
        Infinity,
        50,
        true
    )
    useEffect(() => {
        const runQuery = async () => {
            await ComDOM.start({
                url: new URL("http://localhost:3000/api/subscriptionrulestates"),
                method: "GET",
                headers: new Headers({
                    'Content-Type': 'application/json'
                } as HeadersInit),
                body: null,
            })
        }
        runQuery()
    }, [])
    return (
        <div>
            <ListSubscriptionStory
                accountname={params.account}
                comdom={ComDOM}
            />
        </div>
    )
}
