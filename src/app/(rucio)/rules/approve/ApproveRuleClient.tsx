'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';
import useTableStreaming from '@/lib/infrastructure/hooks/useTableStreaming';
import { RuleViewModel, UpdateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { invalidateForMutation } from '@/lib/infrastructure/query';
import { ApproveRule } from '@/component-library/pages/Rule/approve/ApproveRule';
import { RuleState } from '@/lib/core/entity/rucio';

const APPROVE_QUEUE_URL = `/api/feature/list-rules?${new URLSearchParams({ state: RuleState.WAITING_APPROVAL }).toString()}`;

export const ApproveRuleClient = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { onGridReady, streamingHook, startStreaming, gridApi } = useTableStreaming<RuleViewModel>();

    const [approvingRuleId, setApprovingRuleId] = useState<string | null>(null);
    const [denyingRuleId, setDenyingRuleId] = useState<string | null>(null);

    const hasAutoLoaded = useRef(false);

    // Auto-load waiting rules as soon as the grid is ready.
    // startStreaming is intentionally omitted from deps: it is not memoised and
    // adding it would cause the effect to re-fire on every render, defeating the
    // one-shot load guard.  The ref ensures we only call it once.
    useEffect(
        () => {
            if (!hasAutoLoaded.current && gridApi) {
                hasAutoLoaded.current = true;
                startStreaming(APPROVE_QUEUE_URL);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [gridApi],
    );

    const refreshApprovalQueue = () => {
        startStreaming(APPROVE_QUEUE_URL);
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
            refreshApprovalQueue();
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
            refreshApprovalQueue();
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
        />
    );
};
