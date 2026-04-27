'use client';

import * as React from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { HiInformationCircle } from 'react-icons/hi';

export interface DeleteRuleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ruleId: string;
    onConfirm: (forceDelete: boolean) => void;
    loading?: boolean;
    /** Initial checked state of the force-delete checkbox. Primarily for Storybook/testing. */
    defaultForceDelete?: boolean;
}

/**
 * Confirmation dialog for deleting a replication rule.
 * Soft-delete (default) sets the rule lifetime to 3600 seconds (1 hour).
 * Force-delete sets lifetime to 0, scheduling immediate deletion with no grace period.
 *
 * @example
 * ```tsx
 * <DeleteRuleDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     ruleId="abc123def456"
 *     onConfirm={(forceDelete) => handleDelete(forceDelete)}
 * />
 * ```
 */
export const DeleteRuleDialog: React.FC<DeleteRuleDialogProps> = ({ open, onOpenChange, ruleId, onConfirm, loading = false, defaultForceDelete = false }) => {
    const [forceDelete, setForceDelete] = React.useState(defaultForceDelete);

    // Reset checkbox state when the dialog closes
    React.useEffect(() => {
        if (!open) {
            setForceDelete(false);
        }
    }, [open]);

    const handleSubmit = () => {
        onConfirm(forceDelete);
    };

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Rule"
            description="Schedule this rule for deletion."
            onSubmit={handleSubmit}
            submitLabel="Delete Rule"
            submitVariant="error"
            loading={loading}
        >
            <div className="space-y-4">
                {/* Info tip */}
                <div className="rounded-md bg-base-info-50 dark:bg-base-info-900 p-3 text-sm text-base-info-700 dark:text-base-info-200 flex gap-2 items-start">
                    <HiInformationCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <p>
                        {forceDelete
                            ? 'Force delete will set the rule lifetime to 0, scheduling it for immediate deletion. The server may reject this request depending on the policy configured by your administrator.'
                            : 'Standard delete will set the rule lifetime to 1 hour, scheduling it for deletion with a grace period.'}
                    </p>
                </div>

                {/* Force Delete checkbox — visible to all users; the server enforces policy */}
                <div className="flex items-center gap-3">
                    <Checkbox
                        id="force-delete-checkbox"
                        checked={forceDelete}
                        onCheckedChange={checked => setForceDelete(checked === true)}
                        aria-describedby={forceDelete ? 'force-delete-warning' : undefined}
                    />
                    <label htmlFor="force-delete-checkbox" className="text-sm font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer select-none">
                        Force delete
                    </label>
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
