'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { AuthType } from '@/lib/core/entity/auth-models';
import { navigateTo } from './navigate';

/**
 * How many milliseconds before token expiry to trigger a refresh attempt.
 */
const REFRESH_BEFORE_EXPIRY_MS = 60_000;

/**
 * Minimum scheduling delay to avoid scheduling in the past (e.g. if the
 * computed time-to-fire is already negative).
 */
const MIN_SCHEDULE_DELAY_MS = 0;

// ─── Context ──────────────────────────────────────────────────────────────────

interface SessionMonitorContextValue {
    /**
     * Trigger a manual sign-out.  Marks the sign-out as intentional so the
     * redirect logic does NOT append `?expired=true` to the login URL.
     */
    manualSignOut: () => Promise<void>;
}

export const SessionMonitorContext = createContext<SessionMonitorContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * `SessionMonitorProvider` wraps authenticated routes and:
 *
 * 1. Schedules a timer ~60 s before the Rucio token expires.
 * 2. On timer fire:
 *    - **userpass**: does nothing — session expires naturally and the
 *      unauthenticated-state watcher (see below) handles the redirect.
 *    - **x509 / oidc**: calls `POST /api/auth/refresh`.  On success,
 *      re-schedules the timer; on failure lets the session expire naturally.
 * 3. Watches `status === 'unauthenticated'` and, if the session had
 *    previously been authenticated (i.e. natural expiry, not manual
 *    sign-out), calls `signOut({ redirect: false })` then redirects to
 *    `/auth/login?expired=true&callbackUrl=<current-path>`.
 */
export function SessionMonitorProvider({ children }: { children: ReactNode }) {
    const { data: session, status, update } = useSession();
    const pathname = usePathname();

    /**
     * `true` when the user explicitly triggered a sign-out via
     * `manualSignOut()`.  Prevents the unauthenticated watcher from
     * appending `?expired=true`.
     */
    const isManualSignOutRef = useRef(false);

    /**
     * Tracks whether the session was ever authenticated in this browser
     * context.  Used to distinguish a natural expiry from a page load that
     * was already unauthenticated.
     */
    const wasAuthenticatedRef = useRef(false);

    /** Handle for the pending refresh timer so we can cancel + reschedule. */
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Helper: cancel any pending timer ──────────────────────────────────
    const clearRefreshTimer = useCallback(() => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // ── Helper: call /api/auth/refresh and return success flag ────────────
    const callRefreshApi = useCallback(async (): Promise<boolean> => {
        try {
            const res = await fetch('/api/auth/refresh', { method: 'POST' });
            if (!res.ok) return false;
            const body = (await res.json()) as { success: boolean };
            return body.success === true;
        } catch {
            return false;
        }
    }, []);

    // ── Helper: schedule the pre-expiry refresh timer ─────────────────────
    const scheduleRefreshTimer = useCallback(
        (expiresAt: string, authType: AuthType | null) => {
            clearRefreshTimer();

            const expiryMs = new Date(expiresAt).getTime();
            const nowMs = Date.now();
            const delay = Math.max(MIN_SCHEDULE_DELAY_MS, expiryMs - nowMs - REFRESH_BEFORE_EXPIRY_MS);

            timerRef.current = setTimeout(async () => {
                timerRef.current = null;

                if (authType === AuthType.USERPASS || authType === null) {
                    // userpass: token cannot be refreshed server-side.
                    // Explicitly sign out so NextAuth transitions to
                    // 'unauthenticated', which the watcher below catches and
                    // redirects with ?expired=true. Without this, the session
                    // cookie outlives rucioAuthTokenExpires because NextAuth's
                    // own JWT maxAge is 24 h and useSession() won't refetch
                    // unless the window loses/regains focus.
                    signOut({ redirect: false });
                    return;
                }

                if (authType === AuthType.x509 || authType === AuthType.OIDC) {
                    const success = await callRefreshApi();
                    if (success) {
                        // Sync the client-side session with the refreshed cookie.
                        // When useSession() delivers the updated session (new
                        // rucioAuthTokenExpires), the effect that watches `session`
                        // will fire and re-schedule this timer for the new expiry.
                        await update();
                        return;
                    }
                    // Refresh failed — force sign-out so NextAuth transitions to
                    // 'unauthenticated'. Without this, NextAuth's own JWT maxAge
                    // keeps the session alive regardless of rucioAuthTokenExpires,
                    // and the unauthenticated watcher would never fire.
                    signOut({ redirect: false });
                    return;
                }
            }, delay);
        },
        [clearRefreshTimer, callRefreshApi, update],
    );

    // ── Effect: track authenticated state and schedule/reschedule timer ───
    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            wasAuthenticatedRef.current = true;

            const expiresAt = session.user.rucioAuthTokenExpires;
            const authType = session.user.rucioAuthType;

            if (expiresAt) {
                const expiryMs = new Date(expiresAt).getTime();

                if (Date.now() >= expiryMs) {
                    // Token is already past expiry. NextAuth does not track
                    // rucioAuthTokenExpires, so status will never transition to
                    // 'unauthenticated' on its own — we must act immediately.
                    clearRefreshTimer();
                    if (authType === AuthType.USERPASS || authType === null) {
                        // Sign out and redirect directly to avoid a second
                        // signOut call from the unauthenticated effect.
                        signOut({ redirect: false }).then(() => {
                            const callbackUrl = encodeURIComponent(pathname ?? '/');
                            // Full page navigation so the browser starts a fresh
                            // request AFTER the Set-Cookie: delete from signOut
                            // has been committed to the cookie jar.
                            navigateTo(`/auth/login?expired=true&callbackUrl=${callbackUrl}`);
                        });
                    } else {
                        // x509 / oidc: attempt an immediate refresh (delay ≈ 0).
                        scheduleRefreshTimer(expiresAt, authType);
                    }
                    return;
                }

                scheduleRefreshTimer(expiresAt, authType);
            }
        }

        if (status === 'unauthenticated') {
            clearRefreshTimer();
        }
    }, [status, session, scheduleRefreshTimer, clearRefreshTimer]);

    // ── Effect: redirect when session becomes unauthenticated ─────────────
    useEffect(() => {
        if (status !== 'unauthenticated') return;
        if (!wasAuthenticatedRef.current) return;

        // manualSignOut() already called signOut() and router.push() imperatively.
        // Returning early prevents a double-execution of both actions.
        if (isManualSignOutRef.current) return;

        // Natural expiry: clear any stale NextAuth client-side state, then
        // redirect to the login page with the ?expired=true flag.
        // Use window.location.href (full page load) so the browser sends the
        // new request only after the Set-Cookie: delete from signOut has been
        // committed to the cookie jar — router.push can race against it.
        signOut({ redirect: false }).then(() => {
            const callbackUrl = encodeURIComponent(pathname ?? '/');
            navigateTo(`/auth/login?expired=true&callbackUrl=${callbackUrl}`);
        });
    }, [status, pathname]);

    // ── Cleanup on unmount ─────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            clearRefreshTimer();
        };
    }, [clearRefreshTimer]);

    // ── Manual sign-out handler (exposed via context) ─────────────────────
    const manualSignOut = useCallback(async () => {
        isManualSignOutRef.current = true;
        clearRefreshTimer();
        await signOut({ redirect: false });
        navigateTo('/auth/login?signedOut=true');
    }, [clearRefreshTimer]);

    return <SessionMonitorContext.Provider value={{ manualSignOut }}>{children}</SessionMonitorContext.Provider>;
}

// ─── Public hook ──────────────────────────────────────────────────────────────

/**
 * Returns the `SessionMonitor` context.
 *
 * Use `manualSignOut()` to trigger an explicit sign-out without the
 * `?expired=true` redirect flag.
 *
 * @throws If used outside of a `<SessionMonitorProvider>`.
 */
export function useSessionMonitor(): SessionMonitorContextValue {
    const ctx = useContext(SessionMonitorContext);
    if (!ctx) {
        throw new Error('useSessionMonitor must be used within a <SessionMonitorProvider>');
    }
    return ctx;
}

export default SessionMonitorProvider;
