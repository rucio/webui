'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { Input } from '@/component-library/atoms/form/input';

export interface UpdatePriorityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ruleId: string;
    currentPriority: number;
    onConfirm: (newPriority: number) => void;
    loading?: boolean;
}

/**
 * Dialog for updating the priority of a replication rule.
 * Shows current priority and accepts a new value.
 *
 * @example
 * ```tsx
 * <UpdatePriorityDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     ruleId="abc123"
 *     currentPriority={3}
 *     onConfirm={(priority) => handleUpdate(priority)}
 * />
 * ```
 */
export const UpdatePriorityDialog: React.FC<UpdatePriorityDialogProps> = ({
    open,
    onOpenChange,
    ruleId,
    currentPriority,
    onConfirm,
    loading = false,
}) => {
    const [priority, setPriority] = useState('');
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        if (open) {
            setPriority(String(currentPriority));
            setError(undefined);
        }
    }, [open, currentPriority]);

    const handleSubmit = () => {
        const parsed = parseInt(priority, 10);
        if (isNaN(parsed) || parsed < 0) {
            setError('Enter a non-negative integer');
            return;
        }
        setError(undefined);
        onConfirm(parsed);
    };

    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Update Priority"
            description="Change the transfer priority of this rule. Higher values indicate higher priority."
            onSubmit={handleSubmit}
            submitLabel="Update Priority"
            submitVariant="default"
            loading={loading}
        >
            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">Current priority</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{currentPriority}</span>
                </div>
                <div>
                    <label htmlFor="new-priority" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                        New priority <span className="text-base-error-600">*</span>
                    </label>
                    <Input
                        id="new-priority"
                        type="number"
                        min={0}
                        value={priority}
                        onChange={e => {
                            setPriority(e.target.value);
                            if (error) setError(undefined);
                        }}
                        placeholder="e.g., 5"
                        error={!!error}
                        aria-describedby={error ? 'priority-error' : undefined}
                    />
                    {error && (
                        <p id="priority-error" className="mt-1 text-sm text-base-error-600 dark:text-base-error-400">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </MutationDialog>
    );
};
