'use client';
import { ListSubscription as ListSubscriptionStory } from '@/component-library/Pages/Subscriptions/ListSubscription';
import { Component, useEffect, useState } from 'react';
import useComDOM from '@/lib/infrastructure/hooks/useComDOM';
import { SubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { getSiteHeader } from '../../queries';

export default function ListSubscription({ params }: { params: { account: string } }) {
    const [accountName, setAccountName] = useState<string>('');
    useEffect(() => {
        getSiteHeader().then((data: SiteHeaderViewModel) => {
            setAccountName(data.activeAccount?.rucioAccount ?? 'Unknown');
        });
    }, []);

    const ComDOM = useComDOM<SubscriptionRuleStatesViewModel>('subscription-rule-states-query', [], false, Infinity, 50, true);
    useEffect(() => {
        const runQuery = async () => {
            await ComDOM.start({
                url: new URL(`${process.env.NEXT_PUBLIC_WEBUI_HOST}/api/feature/list-subscription-rule-states`),
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                } as HeadersInit),
                body: null,
            });
        };
        runQuery();
    }, []);
    return (
        <div>
            <ListSubscriptionStory accountname={accountName} comdom={ComDOM} />
        </div>
    );
}
