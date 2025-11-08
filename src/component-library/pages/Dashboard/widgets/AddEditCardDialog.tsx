'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/component-library/atoms/form/button';
import { Input, Textarea } from '@/component-library/atoms/form/input';
import { HotBarCard, HotBarCardType } from '@/lib/core/entity/hotbar';
import { inferCardType, isSameHost } from '@/lib/utils/hotbar-storage';

interface AddEditCardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    card?: HotBarCard | null;
    onSave: (data: { title: string; description?: string; url: string }) => void;
}

/**
 * Get badge color based on card type
 */
function getTypeBadgeStyles(type: HotBarCardType): string {
    switch (type) {
        case HotBarCardType.DID:
        case HotBarCardType.DID_LIST:
            return 'bg-base-info-100 text-base-info-900 dark:bg-base-info-900/20 dark:text-base-info-100';
        case HotBarCardType.RULE:
        case HotBarCardType.RULE_LIST:
            return 'bg-base-success-100 text-base-success-900 dark:bg-base-success-900/20 dark:text-base-success-100';
        case HotBarCardType.RSE:
        case HotBarCardType.RSE_LIST:
            return 'bg-base-warning-100 text-base-warning-900 dark:bg-base-warning-900/20 dark:text-base-warning-100';
        default:
            return 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';
    }
}

/**
 * Format card type for display
 */
function formatCardType(type: HotBarCardType): string {
    return type.replace(/_/g, ' ');
}

export const AddEditCardDialog: React.FC<AddEditCardDialogProps> = ({ open, onOpenChange, card, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [errors, setErrors] = useState<{
        title?: string;
        url?: string;
    }>({});

    const isEditMode = !!card;
    const inferredType = url ? inferCardType(url) : null;

    // Reset form when dialog opens/closes or card changes
    useEffect(() => {
        if (open) {
            setTitle(card?.title || '');
            setDescription(card?.description || '');
            setUrl(card?.url || '');
            setErrors({});
        }
    }, [open, card]);

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!url.trim()) {
            newErrors.url = 'URL is required';
        } else if (!isSameHost(url)) {
            newErrors.url = 'URL must be from the same host';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSave({
            title: title.trim(),
            description: description.trim() || undefined,
            url: url.trim(),
        });

        onOpenChange(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-neutral-900/50 dark:bg-neutral-900/80 z-50" />
                <Dialog.Content
                    className="
                        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        bg-neutral-0 dark:bg-neutral-900
                        border border-neutral-200 dark:border-neutral-700
                        rounded-lg
                        shadow-lg
                        w-full max-w-md
                        p-6
                        z-50
                        focus:outline-none
                    "
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <Dialog.Title className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                            {isEditMode ? 'Edit Bookmark' : 'Add Bookmark'}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button
                                className="
                                    p-1
                                    rounded
                                    hover:bg-neutral-100 dark:hover:bg-neutral-800
                                    focus:outline-none focus:ring-2 focus:ring-brand-500
                                    transition-colors duration-150
                                "
                                aria-label="Close"
                            >
                                <XMarkIcon className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                                Title <span className="text-base-error-600">*</span>
                            </label>
                            <Input
                                id="title"
                                value={title}
                                onChange={e => {
                                    setTitle(e.target.value);
                                    if (errors.title) {
                                        setErrors({ ...errors, title: undefined });
                                    }
                                }}
                                placeholder="e.g., My Important Dataset"
                                className={errors.title ? 'border-base-error-500' : ''}
                            />
                            {errors.title && <p className="mt-1 text-sm text-base-error-600 dark:text-base-error-400">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                                Description (optional)
                            </label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Add a short description..."
                                rows={3}
                            />
                        </div>

                        {/* URL */}
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                                URL <span className="text-base-error-600">*</span>
                            </label>
                            <Input
                                id="url"
                                type="url"
                                value={url}
                                onChange={e => {
                                    setUrl(e.target.value);
                                    if (errors.url) {
                                        setErrors({ ...errors, url: undefined });
                                    }
                                }}
                                placeholder="/did/page/scope:name"
                                className={errors.url ? 'border-base-error-500' : ''}
                            />
                            {errors.url && <p className="mt-1 text-sm text-base-error-600 dark:text-base-error-400">{errors.url}</p>}
                        </div>

                        {/* Inferred Type */}
                        {inferredType && (
                            <div>
                                <div className="block text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">Type (auto-detected)</div>
                                <span
                                    className={`
                                    inline-block
                                    px-3 py-1.5
                                    rounded
                                    text-sm font-medium
                                    ${getTypeBadgeStyles(inferredType)}
                                `}
                                >
                                    {formatCardType(inferredType)}
                                </span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                            <Dialog.Close asChild>
                                <Button variant="neutral" type="button">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button variant="default" type="submit">
                                {isEditMode ? 'Save Changes' : 'Add Bookmark'}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
