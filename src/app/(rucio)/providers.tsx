'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { CommandPaletteProvider } from '@/lib/infrastructure/hooks/useCommandPalette';
import { CommandPaletteWrapper } from '@/component-library/features/command-palette';
import { TipsProvider } from '@/lib/infrastructure/hooks/useTips';
import { TipsPanelWrapper } from '@/component-library/features/tips';

/**
 * Client component that provides React Query, Command Palette, and Tips context.
 * This is separated from the server layout to enable server-side data fetching.
 */
export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <CommandPaletteProvider>
                <TipsProvider>
                    {children}
                    <CommandPaletteWrapper />
                    <TipsPanelWrapper />
                    <ReactQueryDevtools initialIsOpen={false} />
                </TipsProvider>
            </CommandPaletteProvider>
        </QueryClientProvider>
    );
}
