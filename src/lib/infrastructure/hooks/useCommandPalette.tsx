'use client';

/**
 * Command Palette Hook and Context
 * Manages global state and keyboard shortcuts for the command palette
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface CommandPaletteContextType {
    /** Whether the command palette is open */
    isOpen: boolean;

    /** Open the command palette */
    open: () => void;

    /** Close the command palette */
    close: () => void;

    /** Toggle the command palette */
    toggle: () => void;

    /** Open the command palette with a pre-filled search query */
    openWithQuery: (query: string) => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined);

export interface CommandPaletteProviderProps {
    children: ReactNode;
}

/**
 * Command Palette Provider
 * Wraps the app and provides global command palette state
 * Listens for Cmd/Ctrl + K to toggle the palette
 */
export const CommandPaletteProvider: React.FC<CommandPaletteProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const openWithQuery = useCallback((query: string) => {
        // TODO: Implement pre-filled query support
        // This would require passing the query to the CommandPalette component
        setIsOpen(true);
    }, []);

    // Global keyboard listener for Cmd/Ctrl + K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl + K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [toggle]);

    const value: CommandPaletteContextType = {
        isOpen,
        open,
        close,
        toggle,
        openWithQuery,
    };

    return <CommandPaletteContext.Provider value={value}>{children}</CommandPaletteContext.Provider>;
};

/**
 * Hook to access the command palette context
 * @throws Error if used outside of CommandPaletteProvider
 */
export const useCommandPalette = (): CommandPaletteContextType => {
    const context = useContext(CommandPaletteContext);

    if (context === undefined) {
        throw new Error('useCommandPalette must be used within a CommandPaletteProvider');
    }

    return context;
};
