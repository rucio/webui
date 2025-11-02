'use client';

import { CopyableHeading, Heading } from '@/component-library/atoms/misc/Heading';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { LoadingPage } from '@/component-library/pages/system/LoadingPage';
import { TabSwitcher } from '@/component-library/features/tabs/TabSwitcher';
import { useState } from 'react';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { RuleMetaViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { cn } from '@/component-library/utils';
import { DetailsRuleLocks } from '@/component-library/pages/Rule/details/DetailsRuleLocks';
import { DetailsRuleMeta } from '@/component-library/pages/Rule/details/DetailsRuleMeta';
import { Alert } from '@/component-library/atoms/feedback/Alert';

export const DetailsRuleTabs = ({ id, meta }: { id: string; meta: RuleMetaViewModel }) => {
    const tabNames = ['Attributes', 'Locks'];
    const [activeIndex, setActiveIndex] = useState(0);

    const getViewClasses = (index: number) => {
        const visibilityClass = index === activeIndex ? 'flex' : 'hidden';
        return cn('flex-col grow', visibilityClass);
    };

    return (
        <>
            <TabSwitcher tabNames={tabNames} onSwitch={setActiveIndex} activeIndex={activeIndex} />
            <div className={getViewClasses(0)}>
                <DetailsRuleMeta meta={meta} />
            </div>
            <div className={getViewClasses(1)}>
                <div className="rounded-lg bg-neutral-0 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden h-[calc(100vh-20rem)]">
                    <DetailsRuleLocks id={id} />
                </div>
            </div>
        </>
    );
};

export const DetailsRule = ({ id }: { id: string }) => {
    const { toast } = useToast();
    const validator = new BaseViewModelValidator(toast);
    const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);

    const queryMeta = async () => {
        const url = '/api/feature/get-rule?' + new URLSearchParams({ id });

        setFetchErrorMessage(null); // Clear any previous errors
        const res = await fetch(url);
        if (!res.ok) {
            let errorMsg = res.statusText;
            try {
                const json = await res.json();
                errorMsg = json.message || errorMsg;
            } catch (e) {}
            setFetchErrorMessage(errorMsg);
            throw new Error(errorMsg);
        }

        const json = await res.json();
        if (validator.isValid(json)) return json;

        return null;
    };

    const metaQueryKey = ['rule-meta'];
    const {
        data: meta,
        error: metaError,
        isFetching: isMetaFetching,
        refetch,
    } = useQuery<RuleMetaViewModel>({
        queryKey: metaQueryKey,
        queryFn: queryMeta,
        retry: false,
        refetchOnWindowFocus: false,
    });

    if (metaError) {
        return (
            <div className="w-full p-6">
                <Alert
                    variant="error"
                    message={`Failed to load rule ${id}. ${fetchErrorMessage || 'Please try again.'}`}
                    onClose={() => {
                        setFetchErrorMessage(null);
                        refetch();
                    }}
                />
            </div>
        );
    }

    const isLoading = isMetaFetching || meta === undefined;
    if (isLoading) {
        return <LoadingPage message="Loading rule details..." />;
    }

    return (
        <div className="flex flex-col space-y-6 w-full">
            <header className="mb-2">
                <div className="overflow-y-hidden overflow-x-auto whitespace-nowrap">
                    <CopyableHeading text={id} />
                </div>
            </header>
            <DetailsRuleTabs id={id} meta={meta} />
        </div>
    );
};
