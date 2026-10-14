'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { FormField, describedBy } from '@/component-library/features/mutations/FormField';
import { FieldSelect } from '@/component-library/features/mutations/FieldSelect';
import { Input } from '@/component-library/atoms/form/input';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { AccountType, ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS, isKnownAccountType } from '@/lib/core/entity/rucio';
import { isValidEmail } from '@/lib/core/utils/account-validation';

/** Only the fields that changed. `email: null` clears the email. */
export interface EditAccountValues {
    accountType?: AccountType;
    email?: string | null;
}

export interface EditAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: string;
    initial: { accountType: AccountType; email: string | null };
    onSubmit: (values: EditAccountValues) => void;
    loading?: boolean;
    /** Server error, rendered inside the dialog. The dialog stays open. */
    error?: string;
}

const typeLabel = (t: string) => (isKnownAccountType(t) ? ACCOUNT_TYPE_LABELS[t] : t.charAt(0) + t.slice(1).toLowerCase());

/** Dialog for editing the type and email of an account. */
export const EditAccountDialog: React.FC<EditAccountDialogProps> = ({ open, onOpenChange, account, initial, onSubmit, loading = false, error }) => {
    const [accountType, setAccountType] = useState<AccountType>(initial.accountType);
    const [email, setEmail] = useState(initial.email ?? '');

    useEffect(() => {
        if (open) {
            setAccountType(initial.accountType);
            setEmail(initial.email ?? '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const trimmedEmail = email.trim();
    const emailError = trimmedEmail && !isValidEmail(trimmedEmail) ? 'Enter a valid email address' : undefined;
    const typeChanged = accountType !== initial.accountType;
    const emailChanged = trimmedEmail !== (initial.email ?? '');
    const invalid = !!emailError || (!typeChanged && !emailChanged);

    const handleSubmit = () => {
        if (invalid) return;
        const values: EditAccountValues = {};
        if (typeChanged) values.accountType = accountType;
        if (emailChanged) values.email = trimmedEmail || null;
        onSubmit(values);
    };

    const changes: string[] = [];
    if (typeChanged) changes.push(`Type: ${typeLabel(initial.accountType)} -> ${typeLabel(accountType)}`);
    if (emailChanged) changes.push(`Email: ${initial.email || 'none'} -> ${trimmedEmail || 'none'}`);

    const typeOptions = isKnownAccountType(initial.accountType) ? ACCOUNT_TYPES : [initial.accountType, ...ACCOUNT_TYPES];

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Edit account"
            description={`Change the details of ${account}.`}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
            loading={loading}
            disabled={invalid}
        >
            <div className="space-y-4">
                {error && <Alert variant="error" message={error} />}
                <FormField id="edit-account-type" label="Type" required>
                    <FieldSelect
                        id="edit-account-type"
                        value={accountType}
                        onValueChange={v => setAccountType(v as AccountType)}
                        options={typeOptions.map(t => ({ value: t, label: typeLabel(t) }))}
                    />
                </FormField>
                <FormField id="edit-account-email" label="Email" error={emailError} hint="Leave empty to remove the email">
                    <Input
                        id="edit-account-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        error={!!emailError}
                        aria-describedby={describedBy('edit-account-email', { error: emailError, hint: true })}
                    />
                </FormField>
                {changes.length > 0 && (
                    <div className="rounded-md bg-neutral-100 dark:bg-neutral-800 p-3 text-sm text-neutral-900 dark:text-neutral-100">
                        <p className="font-medium mb-1">Changes</p>
                        <ul className="space-y-1">
                            {changes.map(c => (
                                <li key={c}>{c}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </MutationDialog>
    );
};
