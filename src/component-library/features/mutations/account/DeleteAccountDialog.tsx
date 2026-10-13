'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { FormField, describedBy } from '@/component-library/features/mutations/FormField';
import { Input } from '@/component-library/atoms/form/input';
import { Alert } from '@/component-library/atoms/feedback/Alert';

export interface DeleteAccountValues {
    account: string;
}

export interface DeleteAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: string;
    onSubmit: (values: DeleteAccountValues) => void;
    loading?: boolean;
    /** Server error, rendered inside the dialog. The dialog stays open. */
    error?: string;
}

/** Destructive confirmation: the exact account name must be typed before deleting. */
export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({ open, onOpenChange, account, onSubmit, loading = false, error }) => {
    const [typed, setTyped] = useState('');

    useEffect(() => {
        if (open) setTyped('');
    }, [open]);

    const matches = typed === account;

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete account"
            description={`Delete ${account}?`}
            onSubmit={() => matches && onSubmit({ account })}
            submitLabel="Delete account"
            submitVariant="error"
            loading={loading}
            disabled={!matches}
        >
            <div className="space-y-4">
                {error && <Alert variant="error" message={error} />}
                <Alert variant="warning" message="The account is marked as deleted and can no longer be used." />
                <FormField id="delete-account-confirm" label={`Type ${account} to confirm`} hint="The name must match exactly">
                    <Input
                        id="delete-account-confirm"
                        value={typed}
                        onChange={e => setTyped(e.target.value)}
                        autoComplete="off"
                        aria-describedby={describedBy('delete-account-confirm', { hint: true })}
                    />
                </FormField>
            </div>
        </MutationDialog>
    );
};
