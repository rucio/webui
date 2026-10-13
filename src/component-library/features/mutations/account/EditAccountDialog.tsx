'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { FormField, describedBy, selectClassName } from '@/component-library/features/mutations/FormField';
import { CREATABLE_ACCOUNT_TYPES } from '@/component-library/features/mutations/account/CreateAccountDialog';
import { Input } from '@/component-library/atoms/form/input';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { AccountType } from '@/lib/core/entity/rucio';
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

    const typeOptions = CREATABLE_ACCOUNT_TYPES.includes(initial.accountType as (typeof CREATABLE_ACCOUNT_TYPES)[number])
        ? CREATABLE_ACCOUNT_TYPES
        : [initial.accountType, ...CREATABLE_ACCOUNT_TYPES];

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
                    <select
                        id="edit-account-type"
                        className={selectClassName}
                        value={accountType}
                        onChange={e => setAccountType(e.target.value as AccountType)}
                    >
                        {typeOptions.map(t => (
                            <option key={t} value={t}>
                                {t.charAt(0) + t.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
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
            </div>
        </MutationDialog>
    );
};
