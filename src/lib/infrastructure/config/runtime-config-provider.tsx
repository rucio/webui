'use client';

import { createContext, ReactNode, useContext } from 'react';
import type { ClientEnv } from './env.client';

const RuntimeConfigContext = createContext<ClientEnv | null>(null);

/**
 * Makes the runtime configuration read by the server available to client components.
 * Rendered by the root layout with the result of `getRuntimeConfig()`.
 */
export function RuntimeConfigProvider({ config, children }: { config: ClientEnv; children: ReactNode }) {
    return <RuntimeConfigContext.Provider value={config}>{children}</RuntimeConfigContext.Provider>;
}

export function useRuntimeConfig(): ClientEnv {
    const config = useContext(RuntimeConfigContext);
    if (!config) {
        throw new Error('useRuntimeConfig must be used within a RuntimeConfigProvider');
    }
    return config;
}
