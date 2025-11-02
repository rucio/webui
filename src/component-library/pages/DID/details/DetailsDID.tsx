'use client';

import { CopyableHeading, Heading } from '@/component-library/atoms/misc/Heading';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { DIDMetaViewModel } from '@/lib/infrastructure/data/view-model/did';
import { LoadingPage } from '@/component-library/pages/system/LoadingPage';
import { TabSwitcher } from '@/component-library/features/tabs/TabSwitcher';
import { DetailsDIDView, DetailsDIDProps } from '@/component-library/pages/DID/details/views/DetailsDIDView';
import { DetailsDIDAttributes } from '@/component-library/pages/DID/details/views/DetailsDIDAttributes';
import { DetailsDIDFileReplicas } from '@/component-library/pages/DID/details/views/DetailsDIDFileReplicas';
import { useState } from 'react';
import { DetailsDIDMeta } from '@/component-library/pages/DID/details/DetailsDIDMeta';
import { DIDType } from '@/lib/core/entity/rucio';
import { DetailsDIDRules } from '@/component-library/pages/DID/details/views/DetailsDIDRules';
import { cn } from '@/component-library/utils';
import { DetailsDIDParents } from '@/component-library/pages/DID/details/views/DetailsDIDParents';
import { DetailsDIDContents } from '@/component-library/pages/DID/details/views/DetailsDIDContents';
import { DetailsDIDContentsReplicas } from '@/component-library/pages/DID/details/views/DetailsDIDContentsReplicas';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { DetailsDIDDatasetReplicas } from './views/DetailsDIDDatasetReplicas';
import { Alert } from '@/component-library/atoms/feedback/Alert';

type DetailsDIDTablesProps = {
    scope: string;
    name: string;
    type: DIDType;
};

export const DetailsDIDTables = ({ scope, name, type }: DetailsDIDTablesProps) => {
    const allTabs: Map<string, DetailsDIDView> = new Map([
        ['Attributes', DetailsDIDAttributes],
        ['Replicas', DetailsDIDFileReplicas],
        ['Dataset Replicas', DetailsDIDDatasetReplicas],
        ['Rules', DetailsDIDRules],
        ['Parents', DetailsDIDParents],
        ['Contents', DetailsDIDContents],
        ['Contents Replicas', DetailsDIDContentsReplicas],
    ]);

    const tabsByType: Record<DIDType, string[]> = {
        File: ['Replicas', 'Parents', 'Attributes'],
        Dataset: ['Rules', 'Replicas', 'Contents Replicas', 'Attributes', 'Parents'],
        Container: ['Contents', 'Rules', 'Attributes', 'Parents'],
        All: [],
        Collection: [],
        Derived: [],
        Unknown: [],
    };

    const tabNames = tabsByType[type];
    const [activeIndex, setActiveIndex] = useState(0);

    if (tabNames.length === 0) {
        return (
            <WarningField>
                <span>Unsupported type of the DID.</span>
            </WarningField>
        );
    }

    return (
        <>
            <TabSwitcher tabNames={tabNames} onSwitch={setActiveIndex} activeIndex={activeIndex} />
            {tabNames.map((tabName, index) => {
                const ViewComponent = allTabs.get(tabName);
                const visibilityClass = index === activeIndex ? 'flex' : 'hidden';

                if (ViewComponent === undefined) return;

                const viewClasses = cn('flex-col h-[calc(100vh-32rem)]', visibilityClass);

                return (
                    <div key={tabName} className={viewClasses}>
                        <ViewComponent scope={scope} name={name} />
                    </div>
                );
            })}
        </>
    );
};

export const DetailsDID = ({ scope, name }: DetailsDIDProps) => {
    const { toast } = useToast();
    const validator = new BaseViewModelValidator(toast);
    const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);

    const queryMeta = async () => {
        const url = '/api/feature/get-did-meta?' + new URLSearchParams({ scope, name });

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

    const metaQueryKey = ['meta'];
    const {
        data: meta,
        error: metaError,
        isFetching: isMetaFetching,
        refetch,
    } = useQuery<DIDMetaViewModel>({
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
                        message={`Failed to load DID ${scope}:${name}. ${fetchErrorMessage || 'Please try again.'}`}
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
        return <LoadingPage message="Loading DID details..." />;
    }

    return (
        <main className="min-h-screen bg-neutral-0 dark:bg-neutral-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <div className="flex flex-col space-y-6 w-full">
                    <header className="mb-2">
                        <div className="overflow-y-hidden overflow-x-auto whitespace-nowrap">
                            <CopyableHeading text={meta.scope + ':' + meta.name} />
                        </div>
                    </header>
                    <DetailsDIDMeta meta={meta} />
                    <DetailsDIDTables scope={scope} name={name} type={meta.did_type} />
                </div>
            </div>
        </main>
    );
};
