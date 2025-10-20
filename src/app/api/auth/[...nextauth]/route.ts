import { handlers } from '@/lib/infrastructure/auth/auth';

/**
 * NextAuth route handler for the App Router
 * Handles all authentication-related routes:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/session
 * - /api/auth/csrf
 * - /api/auth/providers
 */
export const { GET, POST } = handlers;
