'use client';

import * as React from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { AccountStatus } from '@/lib/core/entity/rucio';

export interface SetAccountStatusValues {
    status: AccountStatus.ACTIVE | AccountStatus.SUSPENDED;
}

export interface SetAccountStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: string;
    mode: 'suspend' | 'reactivate';
    onSubmit: (values: SetAccountStatusValues) => void;
    loading?: boolean;
    /** Server error, rendered inside the dialog. The dialog stays open. */
    error?: string;
}

/** Confirmation dialog for suspending or reactivating an account. */
export const SetAccountStatusDialog: React.FC<SetAccountStatusDialogProps> = ({
    open,
    onOpenChange,
    account,
    mode,
    onSubmit,
    loading = false,
    error,
}) => {
    const suspend = mode === 'suspend';
    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title={suspend ? 'Suspend account' : 'Reactivate account'}
            description={suspend ? `Suspend ${account}?` : `Reactivate ${account}?`}
            onSubmit={() => onSubmit({ status: suspend ? AccountStatus.SUSPENDED : AccountStatus.ACTIVE })}
            submitLabel={suspend ? 'Suspend account' : 'Reactivate account'}
            submitVariant={suspend ? 'error' : 'success'}
            loading={loading}
        >
            <div className="space-y-4">
                {error && <Alert variant="error" message={error} />}
                <p className="text-sm text-neutral-900 dark:text-neutral-100">
                    {suspend
                        ? 'Suspending hides the identities, attributes and quotas of this account. Existing sessions keep working until their tokens expire.'
                        : 'The identities, attributes and quotas of this account become visible again.'}
                </p>
            </div>
        </MutationDialog>
    );
};
