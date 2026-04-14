'use client';

import * as React from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { HiCheckCircle, HiInformationCircle } from 'react-icons/hi';

export interface ApproveRuleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ruleId: string;
    onConfirm: () => void;
    loading?: boolean;
}

/**
 * Confirmation dialog for approving a replication rule that is waiting for approval.
 * Moves the rule from 'Waiting Approval' to an active replication state.
 *
 * @example
 * ```tsx
 * <ApproveRuleDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     ruleId="abc123def456"
 *     onConfirm={handleApprove}
 * />
 * ```
 */
export const ApproveRuleDialog: React.FC<ApproveRuleDialogProps> = ({ open, onOpenChange, ruleId, onConfirm, loading = false }) => {
    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Approve Rule"
            description="Approve this rule to begin active replication."
            onSubmit={onConfirm}
            submitLabel="Approve Rule"
            submitVariant="success"
            loading={loading}
        >
            <div className="space-y-4">
                {/* Tips */}
                <div className="rounded-md bg-base-info-50 dark:bg-base-info-900 p-3 text-sm text-base-info-700 dark:text-base-info-200 flex gap-2 items-start">
                    <HiInformationCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <p>
                        Tips: Approving a rule moves it from &apos;Waiting Approval&apos; to an active replication state. This action is only
                        available to administrators. Once approved, replication will begin.
                    </p>
                </div>

                {/* Success banner */}
                <div className="flex items-start gap-3 rounded-md bg-base-success-50 dark:bg-base-success-950 border border-base-success-200 dark:border-base-success-800 p-3">
                    <HiCheckCircle className="h-5 w-5 shrink-0 text-base-success-600 dark:text-base-success-400 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-base-success-900 dark:text-base-success-100">
                        Approving this rule will activate replication and begin transferring data to the designated RSE.
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
