'use client';

import * as React from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { HiInformationCircle, HiExclamation } from 'react-icons/hi';

export interface DeleteRuleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ruleId: string;
    isAdmin: boolean;
    onConfirm: () => void;
    loading?: boolean;
}

/**
 * Confirmation dialog for deleting a replication rule.
 * Sets the rule lifetime to 1 hour (admin) or 24 hours (user), effectively scheduling deletion.
 *
 * @example
 * ```tsx
 * <DeleteRuleDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     ruleId="abc123def456"
 *     isAdmin={false}
 *     onConfirm={handleDelete}
 * />
 * ```
 */
export const DeleteRuleDialog: React.FC<DeleteRuleDialogProps> = ({ open, onOpenChange, ruleId, isAdmin, onConfirm, loading = false }) => {
    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Rule"
            description="Schedule this rule for deletion by setting a short lifetime."
            onSubmit={onConfirm}
            submitLabel="Delete Rule"
            submitVariant="error"
            loading={loading}
        >
            <div className="space-y-4">
                {/* Tips */}
                <div className="rounded-md bg-base-info-50 dark:bg-base-info-900 p-3 text-sm text-base-info-700 dark:text-base-info-200 flex gap-2 items-start">
                    <HiInformationCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <p>
                        {isAdmin
                            ? 'Tips: As an administrator, this rule will be deleted within 1 hour.'
                            : 'Tips: This will request deletion by setting the rule lifetime to 24 hours. The server may reject this request depending on the policy.'}
                    </p>
                </div>

                {/* Warning banner */}
                <div className="flex items-start gap-3 rounded-md bg-base-error-50 dark:bg-base-error-950 border border-base-error-200 dark:border-base-error-800 p-3">
                    <HiExclamation className="h-5 w-5 shrink-0 text-base-error-600 dark:text-base-error-400 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-base-error-900 dark:text-base-error-100">
                        {isAdmin
                            ? 'This rule will expire in 1 hour. Any ongoing replication will be cancelled.'
                            : 'This rule will expire in 24 hours if the server accepts the request. Any ongoing replication will be cancelled.'}
                    </p>
                </div>

                {/* Rule ID */}
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
