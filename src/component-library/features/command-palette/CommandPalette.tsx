'use client';

/**
 * Command Palette Component
 * Global search and navigation palette with keyboard shortcuts
 * Opens with Cmd/Ctrl + K
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CommandSection, CommandItem } from '@/lib/core/entity/command-palette';
import { CommandPaletteSection } from './CommandPaletteSection';
import { CommandPaletteEmpty } from './CommandPaletteEmpty';
import { getRecentPages, formatRecentPageTime } from '@/lib/utils/recent-pages-storage';
import { getCards } from '@/lib/utils/hotbar-storage';
import { getNavigationCommands, getActionCommands, getHelpCommands } from '@/lib/infrastructure/command-palette/command-registry';
import { navigateToSearch } from '@/lib/infrastructure/utils/navigation';
import { ClockIcon, BookmarkIcon } from '@heroicons/react/24/outline';

export interface CommandPaletteProps {
    /** Whether the palette is open */
    open: boolean;

    /** Callback when palette should close */
    onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Build all sections with filtering
    const sections = useMemo<CommandSection[]>(() => {
        const allSections: CommandSection[] = [];

        // Recent Pages Section
        const recentPages = getRecentPages(5);
        if (recentPages.length > 0) {
            const recentItems: CommandItem[] = recentPages.map(page => ({
                id: `recent-${page.url}`,
                type: 'recent' as const,
                title: page.title,
                description: formatRecentPageTime(page.timestamp),
                icon: ClockIcon,
                url: page.url,
                keywords: [page.title, page.url],
            }));

            allSections.push({
                id: 'recent',
                title: 'Recent',
                items: recentItems,
                icon: ClockIcon,
            });
        }

        // Bookmarks Section
        const bookmarks = getCards();
        if (bookmarks.length > 0) {
            const bookmarkItems: CommandItem[] = bookmarks.map(bookmark => ({
                id: `bookmark-${bookmark.id}`,
                type: 'bookmark' as const,
                title: bookmark.title,
                description: bookmark.description,
                icon: BookmarkIcon,
                url: bookmark.url,
                badge: bookmark.type,
                keywords: [bookmark.title, bookmark.description || '', bookmark.type],
            }));

            allSections.push({
                id: 'bookmarks',
                title: 'Bookmarks',
                items: bookmarkItems,
                icon: BookmarkIcon,
            });
        }

        // Navigation Section
        const navigationItems = getNavigationCommands();
        allSections.push({
            id: 'navigation',
            title: 'Navigation',
            items: navigationItems,
        });

        // Actions Section (adapts to search query)
        const actionItems = getActionCommands(searchQuery);
        allSections.push({
            id: 'actions',
            title: 'Actions',
            items: actionItems,
        });

        // Help Section
        const helpItems = getHelpCommands();
        allSections.push({
            id: 'help',
            title: 'Help',
            items: helpItems,
        });

        // Filter all sections based on search query
        if (searchQuery.trim().length > 0) {
            const lowerQuery = searchQuery.toLowerCase();

            return allSections
                .map(section => ({
                    ...section,
                    items: section.items.filter(item => {
                        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
                        const descriptionMatch = item.description?.toLowerCase().includes(lowerQuery) || false;
                        const keywordsMatch = item.keywords?.some(keyword => keyword.toLowerCase().includes(lowerQuery)) || false;

                        return titleMatch || descriptionMatch || keywordsMatch;
                    }),
                }))
                .filter(section => section.items.length > 0);
        }

        return allSections;
    }, [searchQuery]);

    // Calculate total items count for keyboard navigation
    const totalItems = useMemo(() => {
        return sections.reduce((sum, section) => sum + section.items.length, 0);
    }, [sections]);

    // Get currently selected item
    const selectedItem = useMemo<CommandItem | null>(() => {
        let currentIndex = 0;
        for (const section of sections) {
            if (selectedIndex < currentIndex + section.items.length) {
                return section.items[selectedIndex - currentIndex];
            }
            currentIndex += section.items.length;
        }
        return null;
    }, [sections, selectedIndex]);

    // Reset selection when search changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [searchQuery]);

    // Reset state when palette closes
    useEffect(() => {
        if (!open) {
            setSearchQuery('');
            setSelectedIndex(0);
        }
    }, [open]);

    // Handle item selection
    const handleItemSelect = useCallback(
        (item: CommandItem) => {
            // Execute custom action if provided
            if (item.onSelect) {
                item.onSelect();
            }
            // Navigate to URL if provided
            else if (item.url) {
                navigateToSearch(item.url);
            }

            // Close palette
            onOpenChange(false);
        },
        [onOpenChange],
    );

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev + 1) % Math.max(totalItems, 1));
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev - 1 + totalItems) % Math.max(totalItems, 1));
                    break;

                case 'Enter':
                    e.preventDefault();
                    if (selectedItem) {
                        handleItemSelect(selectedItem);
                    }
                    break;

                case 'Escape':
                    e.preventDefault();
                    // Clear search first, then close palette
                    if (searchQuery.length > 0) {
                        setSearchQuery('');
                    } else {
                        onOpenChange(false);
                    }
                    break;
            }
        },
        [totalItems, selectedItem, handleItemSelect, searchQuery, onOpenChange],
    );

    // Check if there are any results
    const hasResults = sections.some(section => section.items.length > 0);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                {/* Backdrop Overlay */}
                <Dialog.Overlay asChild>
                    <motion.div
                        className="fixed inset-0 bg-neutral-900/50 dark:bg-neutral-900/80 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    />
                </Dialog.Overlay>

                {/* Dialog Content */}
                <Dialog.Content asChild onOpenAutoFocus={e => e.preventDefault()}>
                    <motion.div
                        className="fixed top-[20%] left-1/2 w-[calc(100%-2rem)] max-w-2xl z-50"
                        initial={{ opacity: 0, scale: 0.95, x: '-50%' }}
                        animate={{ opacity: 1, scale: 1, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        {/* Visually Hidden Title for Accessibility */}
                        <VisuallyHidden.Root>
                            <Dialog.Title>Command Palette</Dialog.Title>
                        </VisuallyHidden.Root>

                        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                        <div
                            className="bg-neutral-0 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl overflow-hidden"
                            onKeyDown={handleKeyDown}
                        >
                            {/* Search Input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                                <MagnifyingGlassIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search commands, pages, and more..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent text-base text-neutral-900 dark:text-neutral-0 placeholder:text-neutral-500 focus:outline-none"
                                    // eslint-disable-next-line jsx-a11y/no-autofocus
                                    autoFocus
                                    role="combobox"
                                    aria-expanded={hasResults}
                                    aria-controls="command-palette-results"
                                />
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="flex-shrink-0 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors duration-150"
                                    aria-label="Close command palette"
                                >
                                    <XMarkIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                                </button>
                            </div>

                            {/* Results Container */}
                            <div
                                id="command-palette-results"
                                className="max-h-[60vh] overflow-y-auto p-2"
                                style={{ scrollPaddingTop: '8px', scrollPaddingBottom: '8px' }}
                            >
                                {hasResults ? (
                                    <div className="space-y-6">
                                        {sections.map((section, sectionIndex) => {
                                            // Calculate start index for this section
                                            const startIndex = sections.slice(0, sectionIndex).reduce((sum, s) => sum + s.items.length, 0);

                                            return (
                                                <CommandPaletteSection
                                                    key={section.id}
                                                    section={section}
                                                    selectedIndex={selectedIndex}
                                                    startIndex={startIndex}
                                                    onItemClick={handleItemSelect}
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <CommandPaletteEmpty />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
