'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { FormField, describedBy } from '@/component-library/features/mutations/FormField';
import { Input } from '@/component-library/atoms/form/input';
import { Alert } from '@/component-library/atoms/feedback/Alert';

export interface AddAccountAttributeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entityName: string;
    existingKeys?: string[];
    /** Return an error message for an invalid key, or undefined when valid. Runs on non-empty input. */
    validateKey?: (key: string) => string | undefined;
    /** Return an error message for an invalid value, or undefined when valid. Runs on non-empty input. */
    validateValue?: (value: string) => string | undefined;
    /** Optional notice rendered below the fields, e.g. for privileged attribute keys. */
    warning?: (values: { key: string; value: string }) => React.ReactNode;
    onConfirm: (key: string, value: string) => void;
    loading?: boolean;
    /** Server error, rendered inside the dialog. The dialog stays open. */
    error?: string;
    keyPlaceholder?: string;
    valuePlaceholder?: string;
}

/**
 * Dialog for adding a new attribute to an account.
 * Validates that key and value are non-empty, the key is not a duplicate,
 * and any caller supplied rules.
 *
 * @example
 * ```tsx
 * <AddAccountAttributeDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     entityName="jdoe"
 *     existingKeys={['country', 'nickname']}
 *     onConfirm={(key, value) => handleAdd(key, value)}
 * />
 * ```
 */
export const AddAccountAttributeDialog: React.FC<AddAccountAttributeDialogProps> = ({
    open,
    onOpenChange,
    entityName,
    existingKeys = [],
    validateKey,
    validateValue,
    warning,
    onConfirm,
    loading = false,
    error,
    keyPlaceholder = 'e.g., country',
    valuePlaceholder = 'e.g., CH',
}) => {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {
        if (open) {
            setKey('');
            setValue('');
        }
    }, [open]);

    const trimmedKey = key.trim();
    const trimmedValue = value.trim();

    const keyError = trimmedKey ? (existingKeys.includes(trimmedKey) ? 'This attribute key already exists' : validateKey?.(trimmedKey)) : undefined;
    const valueError = trimmedValue ? validateValue?.(trimmedValue) : undefined;
    const invalid = !trimmedKey || !trimmedValue || !!keyError || !!valueError;

    const handleSubmit = () => {
        if (invalid) return;
        onConfirm(trimmedKey, trimmedValue);
    };

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Add account attribute"
            description={`Add a new attribute to ${entityName}.`}
            onSubmit={handleSubmit}
            submitLabel="Add attribute"
            submitVariant="default"
            loading={loading}
            disabled={invalid}
        >
            <div className="space-y-4">
                {error && <Alert variant="error" message={error} />}
                <FormField id="attr-key" label="Key" required error={keyError}>
                    <Input
                        id="attr-key"
                        value={key}
                        onChange={e => setKey(e.target.value)}
                        placeholder={keyPlaceholder}
                        error={!!keyError}
                        aria-describedby={describedBy('attr-key', { error: keyError })}
                    />
                </FormField>
                <FormField id="attr-value" label="Value" required error={valueError}>
                    <Input
                        id="attr-value"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={valuePlaceholder}
                        error={!!valueError}
                        aria-describedby={describedBy('attr-value', { error: valueError })}
                    />
                </FormField>
                {warning?.({ key: trimmedKey, value: trimmedValue })}
            </div>
        </MutationDialog>
    );
};
