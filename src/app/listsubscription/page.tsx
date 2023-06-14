'use client';
import { SubscriptionRuleStates } from "@/lib/core/entity/rucio";
import { ListSubscription as ListSubscriptionStory } from "@/component-library/components/Pages/Subscriptions/ListSubscription";
import { Component, useEffect, useState } from "react";
import { createSubscriptionRuleStates } from "test/fixtures/table-fixtures";
import useComDOM from "@/lib/infrastructure/hooks/useComDOM";

export default function ListSubscription() {
    const ComDOM = useComDOM<SubscriptionRuleStates>(
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
                subscriptions={{
                    data: ComDOM.query.data,
                    fetchStatus: ComDOM.query.fetchStatus,
                    pageSize: 10,
                }}
            />
        </div>
    )
}
