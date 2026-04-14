'use client';

import * as React from 'react';
import { MutationDialog } from '@/component-library/features/mutations/MutationDialog';
import { HiExclamationCircle } from 'react-icons/hi';

export interface DeleteRSEAttributeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    rseName: string;
    attributeKey: string;
    attributeValue?: string;
    onConfirm: () => void;
    loading?: boolean;
}

/**
 * Confirmation dialog for deleting an RSE attribute.
 * Displays the attribute key and value being deleted.
 *
 * @example
 * ```tsx
 * <DeleteRSEAttributeDialog
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     rseName="CERN-DISK"
 *     attributeKey="fts"
 *     attributeValue="https://fts3.cern.ch:8446"
 *     onConfirm={handleDelete}
 * />
 * ```
 */
export const DeleteRSEAttributeDialog: React.FC<DeleteRSEAttributeDialogProps> = ({
    open,
    onOpenChange,
    rseName,
    attributeKey,
    attributeValue,
    onConfirm,
    loading = false,
}) => {
    return (
        <MutationDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete RSE Attribute"
            description={`Remove an attribute from ${rseName}.`}
            onSubmit={onConfirm}
            submitLabel="Delete Attribute"
            submitVariant="error"
            loading={loading}
        >
            <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-md bg-base-error-50 dark:bg-base-error-950 border border-base-error-200 dark:border-base-error-800 p-3">
                    <HiExclamationCircle className="h-5 w-5 shrink-0 text-base-error-600 dark:text-base-error-400 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-base-error-900 dark:text-base-error-100">
                        This will permanently remove this attribute from the RSE.
                    </p>
                </div>
                <div className="rounded-md bg-neutral-100 dark:bg-neutral-800 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Key</span>
                        <span className="font-mono text-sm font-medium text-neutral-900 dark:text-neutral-100">{attributeKey}</span>
                    </div>
                    {attributeValue !== undefined && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Value</span>
                            <span className="font-mono text-sm text-neutral-900 dark:text-neutral-100 break-all text-right max-w-[60%]">
                                {attributeValue}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </MutationDialog>
    );
};
