'use client';

import { CopyableHeading, Heading } from '@/component-library/atoms/misc/Heading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import { BaseViewModelValidator } from '@/component-library/features/utils/BaseViewModelValidator';
import { LoadingPage } from '@/component-library/pages/system/LoadingPage';
import { TabSwitcher } from '@/component-library/features/tabs/TabSwitcher';
import { useState } from 'react';
import { RuleMetaViewModel, UpdateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { cn } from '@/component-library/utils';
import { DetailsRuleLocks } from '@/component-library/pages/Rule/details/DetailsRuleLocks';
import { DetailsRuleMeta } from '@/component-library/pages/Rule/details/DetailsRuleMeta';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { DetailActions } from '@/component-library/features/mutations/DetailActions';
import { Button } from '@/component-library/atoms/form/button';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { QUERY_KEYS, invalidateForMutation } from '@/lib/infrastructure/query';

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
    const queryClient = useQueryClient();
    const validator = new BaseViewModelValidator(toast);
    const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(null);

    const { mutate: boostRule, isPending: isBoosting } = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/feature/update-rule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ruleId: id, options: { priority: 5 } }),
            });
            const viewModel: UpdateRuleViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: (viewModel) => {
            toast({ variant: 'success', title: 'Rule Boosted', description: viewModel.message || 'Priority set to 5.' });
            invalidateForMutation(queryClient, 'update-rule');
        },
        onError: (error: UpdateRuleViewModel) => {
            toast({ variant: 'error', title: 'Boost Failed', description: error.message || 'Failed to boost rule.' });
        },
    });

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

    const metaQueryKey = [...QUERY_KEYS.RULE_META];
    const {
        data: meta,
        error: metaError,
        isLoading: isMetaLoading,
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

    if (isMetaLoading || !meta) {
        return <LoadingPage message="Loading rule details..." />;
    }

    return (
        <div className="flex flex-col space-y-6 w-full">
            <header className="mb-2">
                <div className="overflow-y-hidden overflow-x-auto whitespace-nowrap">
                    <CopyableHeading text={id} />
                </div>
            </header>
            <DetailActions>
                <Button variant="default" size="sm" loading={isBoosting} onClick={() => boostRule()}>
                    <HiOutlineLightningBolt className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    Boost Rule
                </Button>
            </DetailActions>
            <DetailsRuleTabs id={id} meta={meta} />
        </div>
    );
};
