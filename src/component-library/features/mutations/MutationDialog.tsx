'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/component-library/atoms/form/button';
import { cn } from '@/component-library/utils';

export interface MutationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    onSubmit: () => void;
    submitLabel?: string;
    submitVariant?: 'default' | 'success' | 'error' | 'neutral';
    cancelLabel?: string;
    loading?: boolean;
    disabled?: boolean;
}

/**
 * A reusable dialog wrapper for mutation operations (delete, update, create).
 * Provides consistent layout: title, optional description, form content, and action buttons.
 *
 * @example
 * ```tsx
 * <MutationDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     title="Delete Rule"
 *     description="This action cannot be undone."
 *     onSubmit={handleDelete}
 *     submitLabel="Delete"
 *     submitVariant="error"
 * >
 *     <p>Are you sure you want to delete this rule?</p>
 * </MutationDialog>
 * ```
 */
export const MutationDialog: React.FC<MutationDialogProps> = ({
    open,
    onOpenChange,
    title,
    description,
    children,
    onSubmit,
    submitLabel = 'Confirm',
    submitVariant = 'default',
    cancelLabel = 'Cancel',
    loading = false,
    disabled = false,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-neutral-900/50 dark:bg-neutral-900/80 z-50" />
                <Dialog.Content
                    className={cn(
                        'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                        'bg-neutral-0 dark:bg-neutral-900',
                        'border border-neutral-200 dark:border-neutral-700',
                        'rounded-lg shadow-lg',
                        'w-full max-w-md',
                        'p-6 z-50',
                        'focus:outline-none',
                    )}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 pr-4">
                            <Dialog.Title className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                                {title}
                            </Dialog.Title>
                            {description && (
                                <Dialog.Description className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                    {description}
                                </Dialog.Description>
                            )}
                        </div>
                        <Dialog.Close asChild>
                            <button
                                className={cn(
                                    'p-1 rounded shrink-0',
                                    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                                    'focus:outline-none focus:ring-2 focus:ring-brand-500',
                                    'transition-colors duration-150',
                                )}
                                aria-label="Close"
                            >
                                <XMarkIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">{children}</div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                            <Dialog.Close asChild>
                                <Button variant="neutral" type="button" disabled={loading}>
                                    {cancelLabel}
                                </Button>
                            </Dialog.Close>
                            <Button variant={submitVariant} type="submit" loading={loading} disabled={disabled}>
                                {submitLabel}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
