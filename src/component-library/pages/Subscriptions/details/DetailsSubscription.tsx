'use client';

import { CopyableHeading } from '@/component-library/atoms/misc/Heading';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { LoadingPage } from '@/component-library/pages/system/LoadingPage';
import { useState } from 'react';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { DetailsSubscriptionTabs } from '@/component-library/pages/Subscriptions/details/DetailsSubscriptionTabs';
import { DetailsSubscriptionMeta } from '@/component-library/pages/Subscriptions/details/DetailsSubscriptionMeta';

export type DetailsSubscriptionProps = {
    account: string;
    name: string;
};

export const DetailsSubscription = ({ account, name }: DetailsSubscriptionProps) => {
    const { toast } = useToast();
    const validator = new BaseViewModelValidator(toast);
    const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);

    const queryMeta = async () => {
        const url = '/api/feature/get-subscription?' + new URLSearchParams({ account, name });

        setFetchErrorMessage(null); // Clear any previous errors
        const res = await fetch(url);
        if (!res.ok) {
            let errorMsg = res.statusText;
            try {
                const json = await res.json();
                errorMsg = json.message || json.error || errorMsg;
            } catch (e) {}
            setFetchErrorMessage(errorMsg);
            throw new Error(errorMsg);
        }

        const json = await res.json();
        if (validator.isValid(json)) return json;

        return null;
    };

    const metaQueryKey = ['subscription-meta', account, name];
    const {
        data: meta,
        error: metaError,
        isFetching: isMetaFetching,
        refetch,
    } = useQuery<SubscriptionViewModel>({
        queryKey: metaQueryKey,
        queryFn: queryMeta,
        retry: false,
        refetchOnWindowFocus: false,
    });

    if (metaError) {
        return (
            <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                    <Alert
                        variant="error"
                        message={`Failed to load subscription ${account}:${name}. ${fetchErrorMessage || 'Please try again.'}`}
                        onClose={() => {
                            setFetchErrorMessage(null);
                            refetch();
                        }}
                    />
                </div>
            </main>
        );
    }

    const isLoading = isMetaFetching || meta === undefined;
    if (isLoading) {
        return <LoadingPage message="Loading subscription details..." />;
    }

    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <div className="flex flex-col space-y-6 w-full">
                    <header className="mb-2">
                        <div className="overflow-y-hidden overflow-x-auto whitespace-nowrap">
                            <CopyableHeading text={meta.account + ':' + meta.name} />
                        </div>
                    </header>
                    <DetailsSubscriptionMeta meta={meta} />
                    <DetailsSubscriptionTabs account={account} name={name} meta={meta} />
                </div>
            </div>
        </main>
    );
};
