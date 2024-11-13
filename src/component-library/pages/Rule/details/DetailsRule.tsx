'use client';

import { Heading } from '@/component-library/atoms/misc/Heading';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { LoadingSpinner } from '@/component-library/atoms/loading/LoadingSpinner';
import { TabSwitcher } from '@/component-library/features/tabs/TabSwitcher';
import { useState } from 'react';
import { WarningField } from '@/component-library/features/fields/WarningField';
import { RuleMetaViewModel } from '@/lib/infrastructure/data/view-model/rule';

export const DetailsRuleTabs = ({ id }: { id: string }) => {
    const tabNames = ['Attributes', 'Locks'];
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <>
            <TabSwitcher tabNames={tabNames} onSwitch={setActiveIndex} activeIndex={activeIndex} />
        </>
    );
};

export const DetailsRule = ({ id }: { id: string }) => {
    const { toast } = useToast();
    const validator = new BaseViewModelValidator(toast);

    const queryMeta = async () => {
        const url = '/api/feature/get-rule?' + new URLSearchParams({ id });

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

    const metaQueryKey = ['rule-meta'];
    const {
        data: meta,
        error: metaError,
        isFetching: isMetaFetching,
    } = useQuery<RuleMetaViewModel>({
        queryKey: metaQueryKey,
        queryFn: queryMeta,
        retry: false,
        refetchOnWindowFocus: false,
    });

    if (metaError) {
        return (
            <WarningField>
                <span>Could not load the rule with ID {id}.</span>
            </WarningField>
        );
    }

    const isLoading = isMetaFetching || meta === undefined;
    if (isLoading) {
        return (
            <div className="flex grow items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-3 w-full grow">
            <div className="overflow-y-hidden overflow-x-auto whitespace-nowrap">
                <Heading text={`Rule ${id}`} />
            </div>
            <DetailsRuleTabs id={id} />
        </div>
    );
};
