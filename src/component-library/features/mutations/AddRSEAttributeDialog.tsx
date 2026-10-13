'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Input } from '@/component-library/atoms/form/input';

export interface AddRSEAttributeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    rseName: string;
    existingKeys?: string[];
    onConfirm: (key: string, value: string) => void;
    loading?: boolean;
}

/**
 * Dialog for adding a new attribute to an RSE.
 * Validates that the key is non-empty and not a duplicate.
 *
 * @example
 * ```tsx
 * <AddRSEAttributeDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     rseName="CERN-DISK"
 *     existingKeys={['fts', 'site']}
 *     onConfirm={(key, value) => handleAdd(key, value)}
 * />
 * ```
 */
export const AddRSEAttributeDialog: React.FC<AddRSEAttributeDialogProps> = ({
    open,
    onOpenChange,
    rseName,
    existingKeys = [],
    onConfirm,
    loading = false,
}) => {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [errors, setErrors] = useState<{ key?: string; value?: string }>({});

    useEffect(() => {
        if (open) {
            setKey('');
            setValue('');
            setErrors({});
        }
    }, [open]);

    const handleSubmit = () => {
        const newErrors: typeof errors = {};
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();

        if (!trimmedKey) {
            newErrors.key = 'Key is required';
        } else if (existingKeys.includes(trimmedKey)) {
            newErrors.key = 'This attribute key already exists';
        }

        if (!trimmedValue) {
            newErrors.value = 'Value is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onConfirm(trimmedKey, trimmedValue);
    };

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Add RSE Attribute"
            description={`Add a new attribute to ${rseName}.`}
            onSubmit={handleSubmit}
            submitLabel="Add Attribute"
            submitVariant="default"
            loading={loading}
            disabled={!key.trim() || !value.trim()}
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="attr-key" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        Key <span className="text-base-error-600">*</span>
                    </label>
                    <Input
                        id="attr-key"
                        value={key}
                        onChange={e => {
                            setKey(e.target.value);
                            if (errors.key) setErrors(prev => ({ ...prev, key: undefined }));
                        }}
                        placeholder="e.g., fts"
                        error={!!errors.key}
                        aria-describedby={errors.key ? 'attr-key-error' : undefined}
                    />
                    {errors.key && (
                        <p id="attr-key-error" className="mt-1 text-sm text-base-error-600 dark:text-base-error-400">
                            {errors.key}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="attr-value" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        Value <span className="text-base-error-600">*</span>
                    </label>
                    <Input
                        id="attr-value"
                        value={value}
                        onChange={e => {
                            setValue(e.target.value);
                            if (errors.value) setErrors(prev => ({ ...prev, value: undefined }));
                        }}
                        placeholder="e.g., https://fts3.cern.ch:8446"
                        error={!!errors.value}
                        aria-describedby={errors.value ? 'attr-value-error' : undefined}
                    />
                    {errors.value && (
                        <p id="attr-value-error" className="mt-1 text-sm text-base-error-600 dark:text-base-error-400">
                            {errors.value}
                        </p>
                    )}
                </div>
            </div>
        </MutationDialog>
    );
};
