'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { FormField, describedBy } from '@/component-library/features/mutations/FormField';
import { Input } from '@/component-library/atoms/form/input';
import { Alert } from '@/component-library/atoms/feedback/Alert';

export const EDIT_ATTRIBUTE_WARNING =
    'Rucio cannot update attributes in place. Saving deletes the attribute and creates it again with the new value. If the second step fails, the WebUI tries to restore the previous value.';

export interface EditAccountAttributeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entityName: string;
    /** The key is shown but cannot be changed. */
    attributeKey: string;
    /** The current value, as a string. Prefills the value field. */
    currentValue: string;
    /** Return an error message for an invalid value, or undefined when valid. Runs on non-empty input. */
    validateValue?: (value: string) => string | undefined;
    /** Optional extra notice rendered below the fields, e.g. for privileged attribute keys. */
    warning?: React.ReactNode;
    onConfirm: (value: string) => void;
    loading?: boolean;
    /** Server error, rendered inside the dialog. The dialog stays open. */
    error?: string;
}

/**
 * Dialog for changing the value of an existing account attribute. Rucio has no update endpoint, so the
 * dialog always warns that saving is a delete followed by a create.
 */
export const EditAccountAttributeDialog: React.FC<EditAccountAttributeDialogProps> = ({
    open,
    onOpenChange,
    entityName,
    attributeKey,
    currentValue,
    validateValue,
    warning,
    onConfirm,
    loading = false,
    error,
}) => {
    const [value, setValue] = useState(currentValue);

    useEffect(() => {
        if (open) setValue(currentValue);
    }, [open, currentValue]);

    const trimmedValue = value.trim();
    const valueError = trimmedValue ? validateValue?.(trimmedValue) : undefined;
    const unchanged = trimmedValue === currentValue;
    const invalid = !trimmedValue || unchanged || !!valueError;

    const handleSubmit = () => {
        if (invalid) return;
        onConfirm(trimmedValue);
    };

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Edit account attribute"
            description={`Change the value of an attribute of ${entityName}.`}
            onSubmit={handleSubmit}
            submitLabel="Save"
            submitVariant="default"
            loading={loading}
            disabled={invalid}
        >
            <div className="space-y-4">
                {error && <Alert variant="error" message={error} />}
                <Alert variant="warning" message={EDIT_ATTRIBUTE_WARNING} />
                <FormField id="attr-key" label="Key">
                    <Input id="attr-key" value={attributeKey} readOnly disabled aria-readonly="true" />
                </FormField>
                <FormField id="attr-value" label="Value" required error={valueError}>
                    <Input
                        id="attr-value"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        error={!!valueError}
                        aria-describedby={describedBy('attr-value', { error: valueError })}
                    />
                </FormField>
                {warning}
            </div>
        </MutationDialog>
    );
};
