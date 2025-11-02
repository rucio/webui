/**
 * Command Palette Empty State Component
 * Displays when no search results are found
 */

import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const CommandPaletteEmpty: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            {/* Icon */}
            <div className="mb-4">
                <MagnifyingGlassIcon className="w-12 h-12 text-neutral-400 dark:text-neutral-600" />
            </div>

            {/* Message */}
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">No results found</p>

            {/* Subtext */}
            <p className="text-xs text-neutral-500 dark:text-neutral-500">Try a different search term</p>
        </div>
    );
};
