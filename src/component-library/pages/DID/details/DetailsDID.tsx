'use client';

import { Heading } from '@/component-library/atoms/misc/Heading';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { DIDMetaViewModel } from '@/lib/infrastructure/data/view-model/did';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { TabSwitcher } from '@/component-library/features/tabs/TabSwitcher';
import { DetailsDIDComponent, DetailsDIDProps } from '@/component-library/pages/DID/details/DetailsDIDComponent';
import { DetailsDIDAttributes } from '@/component-library/pages/DID/details/DetailsDIDAttributes';
import { DetailsDIDFileReplicas } from '@/component-library/pages/DID/details/DetailsDIDFileReplicas';
import { useState } from 'react';
import { DetailsDIDMeta } from '@/component-library/pages/DID/details/DetailsDIDMeta';

export const DetailsDIDTables = ({ scope, name }: DetailsDIDProps) => {
    const tabs: Map<string, DetailsDIDComponent> = new Map([
        ['Attributes', DetailsDIDAttributes],
        ['Replicas', DetailsDIDFileReplicas],
    ]);
    const tabNames = Array.from(tabs.keys());
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <>
            <TabSwitcher tabNames={tabNames} onSwitch={setActiveIndex} activeIndex={activeIndex} />
            {tabNames.map((tabName, index) => {
                const ViewComponent = tabs.get(tabName);
                const visibilityClass = index === activeIndex ? 'block' : 'hidden';

                if (ViewComponent === undefined) return;

                return (
                    <div key={tabName} className={visibilityClass}>
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

    const queryMeta = async () => {
        const url = '/api/feature/get-did-meta?' + new URLSearchParams({ scope, name });

        const res = await fetch(url);
        if (!res.ok) {
            try {
                const json = await res.json();
                toast({
                    title: 'Fatal error',
                    description: json.message,
                    variant: 'error',
                });
            } catch (e) {}
            throw new Error(res.statusText);
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
    } = useQuery<DIDMetaViewModel>({
        queryKey: metaQueryKey,
        queryFn: queryMeta,
        retry: false,
        refetchOnWindowFocus: false,
    });

    const isLoading = meta === undefined || isMetaFetching;

    return isLoading ? (
        <LoadingSpinner />
    ) : (
        <div className="flex flex-col space-y-3 w-full grow">
            <div className="overflow-y-hidden overflow-x-auto whitespace-nowrap">
                <Heading text={meta.scope + ':' + meta.name} />
            </div>
            <DetailsDIDMeta meta={meta} />
            <DetailsDIDTables scope={scope} name={name} />
        </div>
    );
};
