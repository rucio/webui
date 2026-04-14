'use client';

/**
 * TipsPanel Component
 * Global tips panel that displays all tips organized by category
 * Can be opened via header button or programmatically
 */

import React, { useState, useMemo, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { HiX, HiLightBulb, HiSearch, HiRefresh } from 'react-icons/hi';
import { cn } from '@/component-library/utils';
import { Tip, TipCategory, TipCategoryLabels, sortTipsByPriority } from '@/lib/infrastructure/tips/tip-registry';
import { TipCard } from './TipCard';

export interface TipsPanelProps {
    /** Whether the panel is open */
    open: boolean;
    /** Callback when panel should close */
    onOpenChange: (open: boolean) => void;
    /** All available tips */
    tips: Tip[];
    /** Set of dismissed tip IDs */
    dismissedTips: Set<string>;
    /** Callback when a tip is dismissed */
    onDismissTip: (tipId: string) => void;
    /** Callback to reset all tips */
    onResetAllTips: () => void;
}

export const TipsPanel: React.FC<TipsPanelProps> = ({ open, onOpenChange, tips, dismissedTips, onDismissTip, onResetAllTips }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showDismissed, setShowDismissed] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);

    // Filter and group tips
    const filteredTips = useMemo(() => {
        let filtered = tips;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(tip => tip.title.toLowerCase().includes(query) || tip.content.toLowerCase().includes(query));
        }

        // Filter by dismissed state
        if (!showDismissed) {
            filtered = filtered.filter(tip => !dismissedTips.has(tip.id));
        }

        return sortTipsByPriority(filtered);
    }, [tips, searchQuery, showDismissed, dismissedTips]);

    // Group tips by category
    const tipsByCategory = useMemo(() => {
        const grouped = new Map<TipCategory, Tip[]>();

        // Initialize categories in display order
        const categoryOrder: TipCategory[] = [
            TipCategory.GETTING_STARTED,
            TipCategory.NAVIGATION,
            TipCategory.DIDS,
            TipCategory.RULES,
            TipCategory.RSES,
            TipCategory.SUBSCRIPTIONS,
            TipCategory.ADVANCED,
        ];

        categoryOrder.forEach(category => {
            const categoryTips = filteredTips.filter(tip => tip.category === category);
            if (categoryTips.length > 0) {
                grouped.set(category, categoryTips);
            }
        });

        return grouped;
    }, [filteredTips]);

    const handleResetClick = useCallback(() => {
        if (confirmReset) {
            onResetAllTips();
            setConfirmReset(false);
        } else {
            setConfirmReset(true);
            // Auto-reset confirm state after 3 seconds
            setTimeout(() => setConfirmReset(false), 3000);
        }
    }, [confirmReset, onResetAllTips]);

    const dismissedCount = dismissedTips.size;
    const totalCount = tips.length;

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                {/* Overlay */}
                <Dialog.Overlay
                    className={cn(
                        'fixed inset-0 z-40',
                        'bg-neutral-900/50 dark:bg-neutral-900/80',
                        'animate-in fade-in-0 duration-200',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                    )}
                />

                {/* Content */}
                <Dialog.Content
                    className={cn(
                        'fixed right-0 top-0 bottom-0 z-50',
                        'w-full max-w-md',
                        'bg-neutral-0 dark:bg-neutral-900',
                        'border-l border-neutral-200 dark:border-neutral-800',
                        'shadow-xl',
                        'flex flex-col',
                        'animate-in slide-in-from-right duration-300',
                        'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
                        'focus:outline-none',
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/50">
                                <HiLightBulb className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div>
                                <Dialog.Title className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Tips & Help</Dialog.Title>
                                <VisuallyHidden.Root>
                                    <Dialog.Description>Browse tips and help content for using Rucio WebUI</Dialog.Description>
                                </VisuallyHidden.Root>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {filteredTips.length} of {totalCount} tips
                                    {dismissedCount > 0 && ` (${dismissedCount} dismissed)`}
                                </p>
                            </div>
                        </div>
                        <Dialog.Close asChild>
                            <button
                                type="button"
                                className={cn(
                                    'p-2 rounded-lg',
                                    'text-neutral-500 dark:text-neutral-400',
                                    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                                    'focus:outline-none focus:ring-2 focus:ring-brand-500',
                                    'transition-colors duration-150',
                                )}
                                aria-label="Close tips panel"
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                        <div className="relative">
                            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search tips..."
                                className={cn(
                                    'w-full pl-9 pr-4 py-2',
                                    'bg-neutral-100 dark:bg-neutral-800',
                                    'border border-transparent',
                                    'rounded-lg',
                                    'text-sm text-neutral-900 dark:text-neutral-100',
                                    'placeholder:text-neutral-500',
                                    'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
                                    'transition-colors duration-150',
                                )}
                            />
                        </div>

                        {/* Show dismissed toggle */}
                        <label className="flex items-center gap-2 mt-3 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showDismissed}
                                onChange={e => setShowDismissed(e.target.checked)}
                                className={cn(
                                    'h-4 w-4 rounded',
                                    'border-neutral-300 dark:border-neutral-600',
                                    'text-brand-600',
                                    'focus:ring-brand-500 focus:ring-offset-0',
                                )}
                            />
                            Show dismissed tips
                        </label>
                    </div>

                    {/* Tips List */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {tipsByCategory.size === 0 ? (
                            <div className="text-center py-8">
                                <HiLightBulb className="h-12 w-12 mx-auto text-neutral-300 dark:text-neutral-600" />
                                <p className="mt-4 text-neutral-500 dark:text-neutral-400">
                                    {searchQuery ? 'No tips match your search' : 'No tips to show'}
                                </p>
                                {dismissedCount > 0 && !showDismissed && (
                                    <button
                                        type="button"
                                        onClick={() => setShowDismissed(true)}
                                        className="mt-2 text-sm text-brand-600 dark:text-brand-400 hover:underline"
                                    >
                                        Show {dismissedCount} dismissed tips
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Array.from(tipsByCategory.entries()).map(([category, categoryTips]) => (
                                    <div key={category}>
                                        <h3
                                            className={cn(
                                                'text-xs font-semibold uppercase tracking-wider',
                                                'text-neutral-500 dark:text-neutral-400',
                                                'mb-3',
                                            )}
                                        >
                                            {TipCategoryLabels[category]}
                                        </h3>
                                        <div className="space-y-3">
                                            {categoryTips.map(tip => (
                                                <TipCard
                                                    key={tip.id}
                                                    tip={tip}
                                                    compact
                                                    isDismissed={dismissedTips.has(tip.id)}
                                                    onDismiss={() => onDismissTip(tip.id)}
                                                    showDismissButton={!dismissedTips.has(tip.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                        <button
                            type="button"
                            onClick={handleResetClick}
                            className={cn(
                                'w-full flex items-center justify-center gap-2 px-4 py-2',
                                'rounded-lg',
                                'text-sm font-medium',
                                confirmReset
                                    ? 'bg-base-warning-100 dark:bg-base-warning-900/50 text-base-warning-700 dark:text-base-warning-300'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
                                'hover:bg-neutral-200 dark:hover:bg-neutral-700',
                                'focus:outline-none focus:ring-2 focus:ring-brand-500',
                                'transition-colors duration-150',
                                dismissedCount === 0 && 'opacity-50 cursor-not-allowed',
                            )}
                            disabled={dismissedCount === 0}
                        >
                            <HiRefresh className="h-4 w-4" />
                            {confirmReset ? 'Click again to confirm reset' : `Reset All Tips (${dismissedCount} dismissed)`}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

TipsPanel.displayName = 'TipsPanel';
