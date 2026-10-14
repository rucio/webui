'use client';

import * as React from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { Input } from '@/component-library/atoms/form/input';
import { FormField, describedBy } from '@/component-library/features/mutations/FormField';
import { AccountLimitLocality } from '@/lib/core/entity/account';

export interface DeleteAccountLimitValues {
    locality: AccountLimitLocality;
    rseExpression: string;
}

export interface DeleteAccountLimitDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: string;
    locality: AccountLimitLocality;
    rseExpression: string;
    /** Type the RSE expression in instead of confirming `rseExpression`. */
    editable?: boolean;
    onSubmit: (values: DeleteAccountLimitValues) => void;
    loading?: boolean;
    /** Server error, rendered inside the dialog. The dialog stays open. */
    error?: string;
}

/**
 * Confirmation dialog for removing a quota from an account.
 * With `editable`, the RSE expression is typed in instead: used when Rucio cannot list the global quotas,
 * so the broken one cannot be picked from the table.
 */
export const DeleteAccountLimitDialog: React.FC<DeleteAccountLimitDialogProps> = ({
    open,
    onOpenChange,
    account,
    locality,
    rseExpression,
    editable = false,
    onSubmit,
    loading = false,
    error,
}) => {
    const [typed, setTyped] = React.useState('');
    React.useEffect(() => {
        if (open) setTyped('');
    }, [open]);
    const expression = editable ? typed.trim() : rseExpression;

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete limit"
            description={`Remove a quota from ${account}.`}
            onSubmit={() => onSubmit({ locality, rseExpression: expression })}
            submitLabel="Delete limit"
            submitVariant="error"
            loading={loading}
            disabled={!expression}
        >
            <div className="space-y-4">
                {error && <Alert variant="error" message={error} />}
                <Alert variant="warning" message="Usage is kept. Only the quota is removed." />
                {editable ? (
                    <FormField id="delete-limit-rse" label="RSE expression" required hint="Enter the expression exactly as it was set.">
                        <Input
                            id="delete-limit-rse"
                            value={typed}
                            onChange={e => setTyped(e.target.value)}
                            autoComplete="off"
                            aria-describedby={describedBy('delete-limit-rse', { hint: true })}
                        />
                    </FormField>
                ) : (
                    <div className="rounded-md bg-neutral-100 dark:bg-neutral-800 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Scope</span>
                            <span className="text-sm text-neutral-900 dark:text-neutral-100">{locality === 'local' ? 'Local' : 'Global'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{locality === 'local' ? 'RSE' : 'RSE expression'}</span>
                            <span className="font-mono text-sm text-neutral-900 dark:text-neutral-100 break-all text-right max-w-[70%]">
                                {rseExpression}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </MutationDialog>
    );
};
