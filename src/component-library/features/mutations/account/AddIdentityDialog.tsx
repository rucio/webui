'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { FormField, describedBy } from '@/component-library/features/mutations/FormField';
import { FieldSelect } from '@/component-library/features/mutations/FieldSelect';
import { Input, Textarea } from '@/component-library/atoms/form/input';
import { Checkbox } from '@/component-library/atoms/form/checkbox';
import { Alert } from '@/component-library/atoms/feedback/Alert';
import { IdentityType } from '@/lib/core/entity/account';
import { IDENTITY_TYPE_HINTS, isValidEmail } from '@/lib/core/utils/account-validation';

type SelectableIdentityType = keyof typeof IDENTITY_TYPE_HINTS;

export interface AddIdentityValues {
    identity: string;
    authType: IdentityType;
    email: string;
    /** Only set for USERPASS. */
    password?: string;
    isDefault: boolean;
}

export interface AddIdentityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: string;
    onSubmit: (values: AddIdentityValues) => void;
    loading?: boolean;
    /** Server error, rendered inside the dialog. The dialog stays open. */
    error?: string;
}

const TYPES = Object.keys(IDENTITY_TYPE_HINTS) as SelectableIdentityType[];

/** Dialog for linking a new identity to an account. */
export const AddIdentityDialog: React.FC<AddIdentityDialogProps> = ({ open, onOpenChange, account, onSubmit, loading = false, error }) => {
    const [authType, setAuthType] = useState<SelectableIdentityType>(IdentityType.X509);
    const [identity, setIdentity] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
        if (open) {
            setAuthType(IdentityType.X509);
            setIdentity('');
            setEmail('');
            setPassword('');
            setConfirm('');
            setIsDefault(false);
        }
    }, [open]);

    const hints = IDENTITY_TYPE_HINTS[authType];
    const isUserpass = authType === IdentityType.USERPASS;
    const trimmedIdentity = identity.trim();
    const trimmedEmail = email.trim();

    const emailError = trimmedEmail && !isValidEmail(trimmedEmail) ? 'Enter a valid email address' : undefined;
    const confirmError = isUserpass && confirm && confirm !== password ? 'Passwords do not match' : undefined;
    const invalid = !trimmedIdentity || !trimmedEmail || !!emailError || (isUserpass && (!password || confirm !== password));

    const handleSubmit = () => {
        if (invalid) return;
        onSubmit({
            identity: trimmedIdentity,
            authType,
            email: trimmedEmail,
            ...(isUserpass ? { password } : {}),
            isDefault,
        });
    };

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Add identity"
            description={`Link a new identity to ${account}.`}
            onSubmit={handleSubmit}
            submitLabel="Add identity"
            loading={loading}
            disabled={invalid}
        >
            <div className="space-y-4">
                {error && <Alert variant="error" message={error} />}
                <FormField id="add-identity-type" label="Type" required>
                    <FieldSelect
                        id="add-identity-type"
                        value={authType}
                        onValueChange={v => {
                            setAuthType(v as SelectableIdentityType);
                            setPassword('');
                            setConfirm('');
                        }}
                        options={TYPES.map(t => ({ value: t, label: IDENTITY_TYPE_HINTS[t].label }))}
                    />
                </FormField>
                <FormField id="add-identity-value" label="Identity" required hint={hints.help}>
                    {hints.multiline ? (
                        <Textarea
                            id="add-identity-value"
                            value={identity}
                            onChange={e => setIdentity(e.target.value)}
                            placeholder={hints.placeholder}
                            autoComplete="off"
                            aria-describedby={describedBy('add-identity-value', { hint: true })}
                        />
                    ) : (
                        <Input
                            id="add-identity-value"
                            value={identity}
                            onChange={e => setIdentity(e.target.value)}
                            placeholder={hints.placeholder}
                            autoComplete="off"
                            aria-describedby={describedBy('add-identity-value', { hint: true })}
                        />
                    )}
                </FormField>
                {isUserpass && (
                    <>
                        <FormField id="add-identity-password" label="Password" required>
                            <Input
                                id="add-identity-password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </FormField>
                        <FormField id="add-identity-confirm" label="Confirm password" required error={confirmError}>
                            <Input
                                id="add-identity-confirm"
                                type="password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                autoComplete="new-password"
                                error={!!confirmError}
                                aria-describedby={describedBy('add-identity-confirm', { error: confirmError })}
                            />
                        </FormField>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Only used if this username does not exist in Rucio yet. Passwords cannot be changed from the WebUI.
                        </p>
                    </>
                )}
                <FormField id="add-identity-email" label="Email" required error={emailError}>
                    <Input
                        id="add-identity-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="jane.doe@example.org"
                        error={!!emailError}
                        aria-describedby={describedBy('add-identity-email', { error: emailError })}
                    />
                </FormField>
                <div className="flex items-center gap-2">
                    <Checkbox id="add-identity-default" checked={isDefault} onCheckedChange={v => setIsDefault(v === true)} />
                    <label htmlFor="add-identity-default" className="text-sm text-neutral-900 dark:text-neutral-100">
                        Default account for this identity
                    </label>
                </div>
            </div>
        </MutationDialog>
    );
};
