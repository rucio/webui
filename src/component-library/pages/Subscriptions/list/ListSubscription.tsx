import { ListSubscriptionTable } from '@/component-library/pages/Subscriptions/list/ListSubscriptionTable';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { SubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { WarningField } from '@/component-library/features/fields/WarningField';

type ListSubscriptionProps = {
    initialData?: SubscriptionRuleStatesViewModel[];
};

export const ListSubscription = (props: ListSubscriptionProps) => {
    const { gridApi, onGridReady, streamingHook, startStreaming } = useTableStreaming<SubscriptionRuleStatesViewModel>(props.initialData);
    const [startedStreaming, setStartedStreaming] = useState(false);

    useEffect(() => {
        if (gridApi !== null && !startedStreaming) {
            startStreaming('/api/feature/list-subscription-rule-states');
            setStartedStreaming(true);
        }
    }, [gridApi, startStreaming]);

    // TODO: replace with server-side request
    const querySiteHeader = async () => {
        const res = await fetch('/api/feature/get-site-header');
        return res.json();
    };

    const {
        data: siteHeader,
        error: siteHeaderError,
        isFetching: isSiteHeaderFetching,
    } = useQuery<SiteHeaderViewModel>({
        queryKey: ['subscription-account'],
        queryFn: querySiteHeader,
        retry: false,
        refetchOnWindowFocus: false,
    });

    if (isSiteHeaderFetching) {
        return (
            <InfoField>
                <span>Loading account information...</span>
            </InfoField>
        );
    }

    if (siteHeaderError || !siteHeader || !siteHeader.activeAccount) {
        console.log(siteHeaderError);
        return (
            <WarningField>
                <span>Failed to load account information</span>
            </WarningField>
        );
    }

    const account = siteHeader.activeAccount.rucioAccount;

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <Heading text="Subscriptions" />
            <Heading size="sm" text={`for account ${account}`} />
            <ListSubscriptionTable streamingHook={streamingHook} onGridReady={onGridReady} account={account} />
        </div>
    );
};
