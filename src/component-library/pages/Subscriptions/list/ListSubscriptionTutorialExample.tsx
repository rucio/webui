// WebUI Tutorial Example Component
// This component demonstrates the list-subscriptions feature from the Developer Onboarding Tutorial
// It lists individual subscription records (not aggregated rule states)

import { ListSubscriptionTutorialTable } from './ListSubscriptionTutorialTable';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type ListSubscriptionTutorialExampleProps = {
    initialData?: SubscriptionViewModel[];
};

export const ListSubscriptionTutorialExample = (props: ListSubscriptionTutorialExampleProps) => {
    // Hook for streaming table data
    const { gridApi, onGridReady, streamingHook, startStreaming } =
        useTableStreaming<SubscriptionViewModel>(props.initialData);

    const [startedStreaming, setStartedStreaming] = useState(false);

    // Start streaming when table is ready
    useEffect(() => {
        if (!props.initialData && gridApi !== null && !startedStreaming) {
            startStreaming('/api/feature/list-subscription');
            setStartedStreaming(true);
        }
    }, [gridApi, startStreaming, startedStreaming]);

    // Get user account (non-streaming query)
    const {
        data: siteHeader,
        error: siteHeaderError,
        isFetching,
    } = useQuery({
        queryKey: ['subscription-account'],
        queryFn: async () => {
            const res = await fetch('/api/feature/get-site-header');
            return res.json();
        },
        retry: false,
    });

    if (isFetching) return <div>Loading...</div>;
    if (siteHeaderError) return <div>Error loading account</div>;

    const account = siteHeader.activeAccount.rucioAccount;

    return (
        <div className="flex flex-col space-y-3 w-full">
            <Heading text="Subscriptions" />
            <Heading size="sm" text={`for account ${account}`} />
            <ListSubscriptionTutorialTable
                streamingHook={streamingHook}
                onGridReady={onGridReady}
                account={account}
            />
        </div>
    );
};
