/**
 * Command Palette Item Component
 * Individual item in the command palette with icon, title, description, and badges
 */

import React from 'react';
import { CommandItem } from '@/lib/core/entity/command-palette';

export interface CommandPaletteItemProps {
    /** Command item data */
    item: CommandItem;

    /** Whether this item is currently selected (keyboard navigation) */
    isSelected: boolean;

    /** Click handler */
    onClick: () => void;
}

export const CommandPaletteItem: React.FC<CommandPaletteItemProps> = ({ item, isSelected, onClick }) => {
    const Icon = item.icon;

    return (
        <div
            role="option"
            aria-selected={isSelected}
            tabIndex={0}
            className={`
                px-4 py-3 cursor-pointer
                transition-colors duration-150
                rounded-lg
                ${isSelected ? 'bg-brand-50 dark:bg-brand-900/20 ring-2 ring-brand-500/50' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}
            `}
            onClick={onClick}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            onMouseEnter={e => {
                // Visual feedback on hover
                e.currentTarget.focus();
            }}
        >
            <div className="flex items-center gap-3">
                {/* Icon */}
                {Icon && (
                    <div className="flex-shrink-0">
                        <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-0 truncate">{item.title}</span>

                        {/* Badge */}
                        {item.badge && (
                            <span className="text-xs px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex-shrink-0">
                                {item.badge}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {item.description && <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate mt-0.5">{item.description}</p>}
                </div>

                {/* Keyboard Shortcut */}
                {item.shortcut && (
                    <div className="flex-shrink-0">
                        <kbd className="text-xs px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-mono">
                            {item.shortcut}
                        </kbd>
                    </div>
                )}
            </div>
        </div>
    );
};
