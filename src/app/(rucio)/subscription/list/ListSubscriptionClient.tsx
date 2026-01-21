'use client';

import { ListSubscription } from '@/component-library/pages/Subscriptions/list/ListSubscription';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SiteHeaderViewModel } from '@/lib/infrastructure/data/view-model/site-header';

export interface ListSubscriptionClientProps {
    accountFilter?: string;
    autoSearch?: boolean;
}

export const ListSubscriptionClient = (props: ListSubscriptionClientProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const hasUpdatedUrl = useRef(false);

    // Fetch site header to get active account if accountFilter is not provided
    const querySiteHeader = async () => {
        const res = await fetch('/api/feature/get-site-header');
        return res.json();
    };

    const {
        data: siteHeader,
        isFetching: isSiteHeaderFetching,
    } = useQuery<SiteHeaderViewModel>({
        queryKey: ['subscription-account-client'],
        queryFn: querySiteHeader,
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !props.accountFilter, // Only fetch if accountFilter is not provided
    });

    // Determine the account to use
    const account = props.accountFilter || siteHeader?.activeAccount?.rucioAccount;

    // Update URL to include account and autoSearch parameters
    useEffect(() => {
        if (!hasUpdatedUrl.current && account && !isSiteHeaderFetching) {
            hasUpdatedUrl.current = true;

            // Build URL parameters
            const urlParams = new URLSearchParams();
            urlParams.set('account', account);
            urlParams.set('autoSearch', 'true');

            // Update the URL using router.replace (doesn't add to history)
            const newUrl = `${pathname}?${urlParams.toString()}`;
            router.replace(newUrl);
        }
    }, [account, isSiteHeaderFetching, pathname, router]);

    return <ListSubscription accountFilter={account} autoSearch={props.autoSearch !== false} />;
};
