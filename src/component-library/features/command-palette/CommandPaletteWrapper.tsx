'use client';

/**
 * Command Palette Wrapper
 * Connects the CommandPalette component to the useCommandPalette context
 */

import React from 'react';
import { CommandPalette } from './CommandPalette';
import { useCommandPalette } from '@/lib/infrastructure/hooks/useCommandPalette';

export const CommandPaletteWrapper: React.FC = () => {
    const { isOpen, open, close } = useCommandPalette();

    const handleOpenChange = (shouldOpen: boolean) => {
        if (shouldOpen) {
            open();
        } else {
            close();
        }
    };

    return <CommandPalette open={isOpen} onOpenChange={handleOpenChange} />;
};
