import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/**
 * Export the NextAuth handlers and utilities
 * This file re-exports the auth functions for easy importing throughout the app
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
