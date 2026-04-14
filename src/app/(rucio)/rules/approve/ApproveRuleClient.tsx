'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { ApproveRuleViewModel, UpdateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { invalidateForMutation } from '@/lib/infrastructure/query';
import { ApproveRule, ApproveRuleFilters } from '@/component-library/pages/Rule/approve/ApproveRule';

export interface ApproveRuleClientProps {
    autoSearch?: boolean;
    initialFilters?: Partial<ApproveRuleFilters>;
}

export const ApproveRuleClient = (props: ApproveRuleClientProps) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const { onGridReady, streamingHook, startStreaming, stopStreaming, gridApi } = useTableStreaming<ApproveRuleViewModel>();

    const [approvingRuleId, setApprovingRuleId] = useState<string | null>(null);
    const [denyingRuleId, setDenyingRuleId] = useState<string | null>(null);

    const hasAutoLoaded = useRef(false);

    const buildSearchUrl = (filters?: ApproveRuleFilters): string => {
        const params = new URLSearchParams();
        if (filters?.account) params.append('account', filters.account);
        if (filters?.activity) params.append('activity', filters.activity);
        if (filters?.scope && filters.scope !== '*') params.append('scope', filters.scope);
        if (filters?.name) params.append('name', filters.name);
        if (filters?.updatedBefore) params.append('updated_before', filters.updatedBefore.toISOString());
        if (filters?.updatedAfter) params.append('updated_after', filters.updatedAfter.toISOString());
        return `/api/feature/list-rules-pending-approval?${params.toString()}`;
    };

    // Auto-load when grid is ready and autoSearch is true (or no filters = default load)
    useEffect(
        () => {
            if (!hasAutoLoaded.current && gridApi) {
                hasAutoLoaded.current = true;
                if (props.autoSearch) {
                    startStreaming(buildSearchUrl(props.initialFilters as ApproveRuleFilters));
                } else {
                    // Default: load all pending approval rules
                    startStreaming(buildSearchUrl());
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [gridApi],
    );

    const syncUrlWithFilters = useCallback(
        (filters: ApproveRuleFilters) => {
            const urlParams = new URLSearchParams();
            urlParams.set('autoSearch', 'true');

            if (filters.account) urlParams.set('account', filters.account);
            if (filters.activity) urlParams.set('activity', filters.activity);
            if (filters.scope && filters.scope !== '*') urlParams.set('scope', filters.scope);
            if (filters.name) urlParams.set('name', filters.name);

            if (filters.updatedBefore) {
                const y = filters.updatedBefore.getFullYear();
                const m = String(filters.updatedBefore.getMonth() + 1).padStart(2, '0');
                const d = String(filters.updatedBefore.getDate()).padStart(2, '0');
                urlParams.set('updated_before', `${y}-${m}-${d}`);
            }
            if (filters.updatedAfter) {
                const y = filters.updatedAfter.getFullYear();
                const m = String(filters.updatedAfter.getMonth() + 1).padStart(2, '0');
                const d = String(filters.updatedAfter.getDate()).padStart(2, '0');
                urlParams.set('updated_after', `${y}-${m}-${d}`);
            }

            router.push(`${pathname}?${urlParams.toString()}`);
        },
        [router, pathname],
    );

    const refreshResults = () => {
        startStreaming(buildSearchUrl());
    };

    const handleSearch = (filters: ApproveRuleFilters) => {
        syncUrlWithFilters(filters);
        startStreaming(buildSearchUrl(filters));
    };

    const handleStop = () => {
        stopStreaming();
    };

    const approveMutation = useMutation({
        mutationFn: async (ruleId: string) => {
            const res = await fetch('/api/feature/update-rule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ruleId, options: { approve: true } }),
            });
            const viewModel: UpdateRuleViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: () => {
            invalidateForMutation(queryClient, 'update-rule');
            toast({ variant: 'success', title: 'Rule approved', description: 'The rule has been approved and replication will begin.' });
            refreshResults();
        },
        onError: (error: UpdateRuleViewModel) => {
            toast({ variant: 'error', title: 'Failed to approve rule', description: error.message || 'An unexpected error occurred.' });
        },
        onSettled: () => {
            setApprovingRuleId(null);
        },
    });

    const denyMutation = useMutation({
        mutationFn: async ({ ruleId, comment }: { ruleId: string; comment?: string }) => {
            const options: Record<string, unknown> = { approve: false };
            if (comment) options.comment = comment;
            const res = await fetch('/api/feature/update-rule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ruleId, options }),
            });
            const viewModel: UpdateRuleViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: () => {
            invalidateForMutation(queryClient, 'update-rule');
            toast({ variant: 'success', title: 'Rule denied', description: 'The rule has been denied.' });
            refreshResults();
        },
        onError: (error: UpdateRuleViewModel) => {
            toast({ variant: 'error', title: 'Failed to deny rule', description: error.message || 'An unexpected error occurred.' });
        },
        onSettled: () => {
            setDenyingRuleId(null);
        },
    });

    const handleApprove = (ruleId: string) => {
        setApprovingRuleId(ruleId);
        approveMutation.mutate(ruleId);
    };

    const handleDeny = (ruleId: string, comment?: string) => {
        setDenyingRuleId(ruleId);
        denyMutation.mutate({ ruleId, comment });
    };

    return (
        <ApproveRule
            streamingHook={streamingHook}
            onGridReady={onGridReady}
            onApprove={handleApprove}
            onDeny={handleDeny}
            approvingRuleId={approvingRuleId}
            denyingRuleId={denyingRuleId}
            onSearch={handleSearch}
            onStop={handleStop}
            initialFilters={props.initialFilters}
        />
    );
};
