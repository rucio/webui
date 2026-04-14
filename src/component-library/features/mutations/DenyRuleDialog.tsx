'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Textarea } from '@/component-library/atoms/form/input';
import { HiInformationCircle, HiXCircle } from 'react-icons/hi';

export interface DenyRuleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ruleId: string;
    onConfirm: (comment?: string) => void;
    loading?: boolean;
}

/**
 * Confirmation dialog for denying a replication rule that is waiting for approval.
 * Sends an updateRule request with approve=false and an optional comment.
 *
 * @example
 * ```tsx
 * <DenyRuleDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     ruleId="abc123def456"
 *     onConfirm={(comment) => handleDeny(comment)}
 * />
 * ```
 */
export const DenyRuleDialog: React.FC<DenyRuleDialogProps> = ({ open, onOpenChange, ruleId, onConfirm, loading = false }) => {
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (open) {
            setComment('');
        }
    }, [open]);

    const handleSubmit = () => {
        const trimmed = comment.trim();
        onConfirm(trimmed || undefined);
    };

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Deny Rule"
            description="Deny this rule to reject the replication request."
            onSubmit={handleSubmit}
            submitLabel="Deny Rule"
            submitVariant="error"
            loading={loading}
        >
            <div className="space-y-4">
                {/* Tips */}
                <div className="rounded-md bg-base-info-50 dark:bg-base-info-900 p-3 text-sm text-base-info-700 dark:text-base-info-200 flex gap-2 items-start">
                    <HiInformationCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <p>
                        Tips: Denying a rule rejects the replication request. This action is only available to administrators.
                        You may optionally provide a reason for the denial.
                    </p>
                </div>

                {/* Warning banner */}
                <div className="flex items-start gap-3 rounded-md bg-base-error-50 dark:bg-base-error-950 border border-base-error-200 dark:border-base-error-800 p-3">
                    <HiXCircle className="h-5 w-5 shrink-0 text-base-error-600 dark:text-base-error-400 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-base-error-900 dark:text-base-error-100">
                        Denying this rule will reject the replication request. No data will be transferred.
                    </p>
                </div>

                {/* Rule ID */}
                <div>
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Rule ID</span>
                    <p className="mt-1 font-mono text-sm text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-1.5 break-all">
                        {ruleId}
                    </p>
                </div>

                {/* Optional comment */}
                <div>
                    <label htmlFor="deny-rule-comment" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        Comment <span className="text-neutral-400 dark:text-neutral-500 font-normal">(optional)</span>
                    </label>
                    <Textarea
                        id="deny-rule-comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Reason for denial..."
                    />
                </div>
            </div>
        </MutationDialog>
    );
};
