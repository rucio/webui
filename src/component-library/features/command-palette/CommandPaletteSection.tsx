/**
 * Command Palette Section Component
 * Groups command items under a labeled section
 */

import React from 'react';
import { CommandSection, CommandItem } from '@/lib/core/entity/command-palette';
import { CommandPaletteItem } from './CommandPaletteItem';

export interface CommandPaletteSectionProps {
    /** Section data */
    section: CommandSection;

    /** Currently selected global item index */
    selectedIndex: number;

    /** Starting index for this section (for global keyboard navigation) */
    startIndex: number;

    /** Item click handler */
    onItemClick: (item: CommandItem) => void;
}

export const CommandPaletteSection: React.FC<CommandPaletteSectionProps> = ({ section, selectedIndex, startIndex, onItemClick }) => {
    // Don't render if section has no items
    if (section.items.length === 0) {
        return null;
    }

    return (
        <div className="command-palette-section">
            {/* Section Header */}
            <div className="px-4 py-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{section.title}</h3>
            </div>

            {/* Section Items */}
            <div className="space-y-0.5" role="listbox">
                {section.items.map((item, index) => {
                    const globalIndex = startIndex + index;
                    const isSelected = globalIndex === selectedIndex;

                    return <CommandPaletteItem key={item.id} item={item} isSelected={isSelected} onClick={() => onItemClick(item)} />;
                })}
            </div>
        </div>
    );
};
