'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { FormField, describedBy } from '@/component-library/features/mutations/FormField';
import { FieldSelect } from '@/component-library/features/mutations/FieldSelect';
import { Input } from '@/component-library/atoms/form/input';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { AccountType } from '@/lib/core/entity/rucio';
import { isValidAccountName, isValidEmail } from '@/lib/core/utils/account-validation';

export const CREATABLE_ACCOUNT_TYPES = [AccountType.USER, AccountType.GROUP, AccountType.SERVICE] as const;

export interface CreateAccountValues {
    account: string;
    accountType: AccountType;
    email: string | null;
}

export interface CreateAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: CreateAccountValues) => void;
    loading?: boolean;
    /** Server error, rendered inside the dialog. The dialog stays open. */
    error?: string;
}

/** Dialog for creating a new Rucio account. */
export const CreateAccountDialog: React.FC<CreateAccountDialogProps> = ({ open, onOpenChange, onSubmit, loading = false, error }) => {
    const [account, setAccount] = useState('');
    const [accountType, setAccountType] = useState<AccountType>(AccountType.USER);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (open) {
            setAccount('');
            setAccountType(AccountType.USER);
            setEmail('');
        }
    }, [open]);

    const trimmedAccount = account.trim();
    const trimmedEmail = email.trim();
    const accountError =
        trimmedAccount && !isValidAccountName(trimmedAccount) ? 'Use 1 to 25 lowercase letters, digits, hyphens, or underscores' : undefined;
    const emailError = trimmedEmail && !isValidEmail(trimmedEmail) ? 'Enter a valid email address' : undefined;
    const invalid = !trimmedAccount || !!accountError || !!emailError;

    const handleSubmit = () => {
        if (invalid) return;
        onSubmit({ account: trimmedAccount, accountType, email: trimmedEmail || null });
    };

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Create account"
            description="Add a new account to Rucio."
            onSubmit={handleSubmit}
            submitLabel="Create account"
            loading={loading}
            disabled={invalid}
        >
            <div className="space-y-4">
                {error && <Alert variant="error" message={error} />}
                <FormField id="create-account-name" label="Name" required error={accountError} hint="Lowercase letters, digits, - and _ only">
                    <Input
                        id="create-account-name"
                        value={account}
                        onChange={e => setAccount(e.target.value)}
                        placeholder="e.g., jdoe"
                        error={!!accountError}
                        aria-describedby={describedBy('create-account-name', { error: accountError, hint: true })}
                    />
                </FormField>
                <FormField id="create-account-type" label="Type" required>
                    <FieldSelect
                        id="create-account-type"
                        value={accountType}
                        onValueChange={v => setAccountType(v as AccountType)}
                        options={CREATABLE_ACCOUNT_TYPES.map(t => ({ value: t, label: t.charAt(0) + t.slice(1).toLowerCase() }))}
                    />
                </FormField>
                <FormField id="create-account-email" label="Email" error={emailError}>
                    <Input
                        id="create-account-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Optional"
                        error={!!emailError}
                        aria-describedby={describedBy('create-account-email', { error: emailError })}
                    />
                </FormField>
            </div>
        </MutationDialog>
    );
};
