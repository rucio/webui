'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { UpdateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { invalidateForMutation } from '@/lib/infrastructure/query';
import { useToast } from '@/lib/infrastructure/hooks/useToast';

export interface ApproveRuleDialogProps {
    ruleId: string;
    onClose: () => void;
    show: boolean;
}

function getErrorMessage(error: UpdateRuleViewModel): string {
    switch (error.errorType) {
        case 'unauthorized':
            return 'You are not authorized to approve this rule. Please log in and try again.';
        case 'permission_denied':
            return 'You do not have permission to approve this rule.';
        case 'not_found':
            return 'The rule could not be found. It may have been deleted.';
        case 'conflict':
            return 'There is a conflict approving this rule. It may have been modified concurrently.';
        case 'unknown':
        default:
            return error.message || 'An unexpected error occurred while approving the rule.';
    }
}

/**
 * Dialog for approving a replication rule that is pending approval.
 * Accepts an optional comment/reason for the approval decision.
 *
 * @example
 * ```tsx
 * <ApproveRuleDialog
 *     ruleId="abc123"
 *     show={isOpen}
 *     onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export const ApproveRuleDialog: React.FC<ApproveRuleDialogProps> = ({ ruleId, show, onClose }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [comment, setComment] = useState('');

    useEffect(() => {
        if (show) {
            setComment('');
        }
    }, [show]);

    const { mutate, isPending } = useMutation({
        mutationFn: async (approvalComment: string | undefined) => {
            const res = await fetch('/api/feature/update-rule', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ruleId,
                    options: {
                        approve: true,
                        ...(approvalComment ? { comment: approvalComment } : {}),
                    },
                }),
            });
            const viewModel: UpdateRuleViewModel = await res.json();
            if (!res.ok || viewModel.status !== 'success') {
                throw viewModel;
            }
            return viewModel;
        },
        onSuccess: () => {
            toast({ variant: 'success', title: 'Rule Approved', description: 'The replication rule has been approved successfully.' });
            invalidateForMutation(queryClient, 'update-rule');
            onClose();
        },
        onError: (error: UpdateRuleViewModel) => {
            toast({ variant: 'error', title: 'Approval Failed', description: getErrorMessage(error) });
        },
    });

    const handleSubmit = () => {
        mutate(comment.trim() || undefined);
    };

    return (
        <MutationDialog
            open={show}
            onOpenChange={open => {
                if (!open) onClose();
            }}
            title="Approve Rule"
            description="Approve this replication rule to allow transfers to proceed."
            onSubmit={handleSubmit}
            submitLabel="Approve Rule"
            submitVariant="success"
            loading={isPending}
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="approve-comment" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        Comment <span className="text-neutral-500 dark:text-neutral-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        id="approve-comment"
                        rows={3}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Enter a reason or notes for this approval..."
                        className="w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-neutral-0 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    />
                    <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        Optionally provide a comment to explain the reason for approving this rule.
                    </p>
                </div>
            </div>
        </MutationDialog>
    );
};

export default ApproveRuleDialog;
