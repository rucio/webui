'use client';

import { Alert } from '@/component-library/atoms/feedback/Alert';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { LoadingPage } from '@/component-library/pages/system';
import { SubscriptionViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { QUERY_KEYS } from '@/lib/infrastructure/query';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { use, useState } from 'react';

export default function PageSubscription({ params }: { params: Promise<{ id: string }> }) {
    const id = decodeURIComponent(use(params).id);

    const { toast } = useToast();
    const validator = new BaseViewModelValidator(toast);
    const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);

    const queryMeta = async () => {
        const url = '/api/feature/get-subscription-by-id?' + new URLSearchParams({ id });
        console.log(url);

        const res = await fetch(url);
        if (!res.ok) {
            let errorMessage = res.statusText;
            try {
                const json = await res.json();
                errorMessage = json.message || json.error || errorMessage;
            } catch (e) {}
            setFetchErrorMessage(errorMessage);
            throw new Error(errorMessage);
        }

        const json = await res.json();
        if (validator.isValid(json)) return json;

        return null;
    };

    const metaQueryKey = [...QUERY_KEYS.SUBSCRIPTION_META, id];
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
                        message={`Failed to load subscription ${id}. Error: ${fetchErrorMessage}`}
                        onClose={() => {
                            setFetchErrorMessage(null);
                            refetch();
                        }}
                    />
                </div>
            </main>
        );
    }

    if (isMetaFetching || !meta) {
        return <LoadingPage message="Loading subscription details..." />;
    }

    const account = meta.account;
    const name = meta.name;
    redirect(`/subscription/${encodeURIComponent(account)}/${encodeURIComponent(name)}`);
}
