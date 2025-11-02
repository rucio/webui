'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { CommandPaletteProvider } from '@/lib/infrastructure/hooks/useCommandPalette';
import { CommandPaletteWrapper } from '@/component-library/features/command-palette';

/**
 * Client component that provides React Query and Command Palette context.
 * This is separated from the server layout to enable server-side data fetching.
 */
export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <CommandPaletteProvider>
                {children}
                <CommandPaletteWrapper />
                <ReactQueryDevtools initialIsOpen={false} />
            </CommandPaletteProvider>
        </QueryClientProvider>
    );
}
