'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

/**
 * Client-side SessionProvider wrapper for NextAuth
 * This must be a client component to use NextAuth's SessionProvider
 */
export function SessionProvider({ children }: { children: ReactNode }) {
    return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
