'use client';

import { ListSubscriptionTable } from '@/component-library/pages/Subscriptions/list/ListSubscriptionTable';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { SubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { Heading } from '@/component-library/atoms/misc/Heading';
import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';
import { InfoField } from '@/component-library/features/fields/InfoField';
import { WarningField } from '@/component-library/features/fields/WarningField';

type ListSubscriptionProps = {
    initialData?: SubscriptionRuleStatesViewModel[];
    accountFilter?: string;
    autoSearch?: boolean;
};

export const ListSubscription = (props: ListSubscriptionProps) => {
    const { gridApi, onGridReady, streamingHook, startStreaming } = useTableStreaming<SubscriptionRuleStatesViewModel>(props.initialData);
    const hasAutoSearched = useRef(false);

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
        enabled: !props.accountFilter, // Only fetch if accountFilter is not provided
    });

    // Use accountFilter if provided, otherwise fall back to activeAccount
    const account = props.accountFilter || siteHeader?.activeAccount?.rucioAccount;

    // Auto-trigger streaming if autoSearch is true (or undefined for backward compatibility) and gridApi is available
    useEffect(() => {
        const shouldAutoSearch = props.autoSearch !== false; // Auto-search by default if undefined

        if (!hasAutoSearched.current && shouldAutoSearch && !props.initialData && gridApi && account) {
            hasAutoSearched.current = true;
            const url = `/api/feature/list-subscription-rule-states?account=${encodeURIComponent(account)}`;
            startStreaming(url);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gridApi, account]); // Only depend on gridApi and account (props.autoSearch, props.initialData, and startStreaming are intentionally excluded)

    if (!props.accountFilter && isSiteHeaderFetching) {
        return (
            <InfoField>
                <span>Loading account information...</span>
            </InfoField>
        );
    }

    if (!props.accountFilter && (siteHeaderError || !siteHeader || !siteHeader.activeAccount)) {
        console.log(siteHeaderError);
        return (
            <WarningField>
                <span>Failed to load account information</span>
            </WarningField>
        );
    }

    if (!account) {
        return (
            <WarningField>
                <span>No account specified</span>
            </WarningField>
        );
    }

    return (
        <div className="flex flex-col space-y-3 w-full">
            <Heading size="sm" className="text-neutral-600 dark:text-neutral-400">
                for account {account}
            </Heading>
            <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[calc(100vh-20rem)]">
                <ListSubscriptionTable streamingHook={streamingHook} onGridReady={onGridReady} account={account} />
            </div>
        </div>
    );
};
