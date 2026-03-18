'use client';

import * as React from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { HiExclamationCircle } from 'react-icons/hi';

export interface DeleteRuleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ruleId: string;
    onConfirm: () => void;
    loading?: boolean;
}

/**
 * Confirmation dialog for deleting a replication rule.
 * Displays the rule ID and a warning that this action cannot be undone.
 *
 * @example
 * ```tsx
 * <DeleteRuleDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     ruleId="abc123def456"
 *     onConfirm={handleDelete}
 * />
 * ```
 */
export const DeleteRuleDialog: React.FC<DeleteRuleDialogProps> = ({ open, onOpenChange, ruleId, onConfirm, loading = false }) => {
    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Rule"
            description="This action cannot be undone."
            onSubmit={onConfirm}
            submitLabel="Delete Rule"
            submitVariant="error"
            loading={loading}
        >
            <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-md bg-base-error-50 dark:bg-base-error-950 border border-base-error-200 dark:border-base-error-800 p-3">
                    <HiExclamationCircle className="h-5 w-5 shrink-0 text-base-error-600 dark:text-base-error-400 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-base-error-900 dark:text-base-error-100">
                        Deleting this rule will cancel all pending transfers and remove all associated locks. Existing replicas will not be
                        deleted.
                    </p>
                </div>
                <div>
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Rule ID</span>
                    <p className="mt-1 font-mono text-sm text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-1.5 break-all">
                        {ruleId}
                    </p>
                </div>
            </div>
        </MutationDialog>
    );
};
