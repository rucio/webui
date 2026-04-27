/**
 * @jest-environment jsdom
 *
 * Unit tests for SessionMonitorProvider (src/lib/infrastructure/auth/session-monitor.tsx).
 *
 * Coverage:
 * (1) Timer fires ~60 s before token expiry.
 * (2) Successful OIDC refresh calls update() which triggers timer re-scheduling.
 * (3) Failed refresh does NOT call update(); session is allowed to expire naturally.
 * (4) Transition from authenticated → unauthenticated redirects to
 *     /auth/login?expired=true&callbackUrl=... (natural expiry).
 * (5) manualSignOut() redirects to /auth/login WITHOUT ?expired=true.
 * (6) userpass auth type opens the in-place re-auth modal when the timer fires (#628).
 */

// ──────────────────────────────────────────────────────────────────────────────
// Module mocks
// ──────────────────────────────────────────────────────────────────────────────

jest.mock('next-auth/react');
jest.mock('next/navigation');
jest.mock('@/lib/infrastructure/auth/navigate');

// ──────────────────────────────────────────────────────────────────────────────
// Real imports (after mocks)
// ──────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { SessionMonitorProvider, useSessionMonitor } from '@/lib/infrastructure/auth/session-monitor';
import { navigateTo } from '@/lib/infrastructure/auth/navigate';
import { AuthType, Role } from '@/lib/core/entity/auth-models';
import type { SessionUser } from '@/lib/core/entity/auth-models';

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function makeUser(overrides: Partial<SessionUser> = {}): SessionUser {
    return {
        rucioIdentity: 'ddmlab',
        rucioAccount: 'root',
        rucioVO: 'def',
        rucioAuthToken: 'token-abc',
        rucioAuthTokenExpires: new Date(Date.now() + 90_000).toISOString(),
        rucioAuthType: AuthType.OIDC,
        rucioOIDCProvider: 'cern',
        role: Role.USER,
        isLoggedIn: true,
        ...overrides,
    };
}

/**
 * A child component that exposes the `manualSignOut` function via a callback
 * so tests can call it imperatively.
 */
function ManualSignOutConsumer({ onReady }: { onReady: (fn: () => Promise<void>) => void }) {
    const { manualSignOut } = useSessionMonitor();
    React.useEffect(() => {
        onReady(manualSignOut);
    }, [manualSignOut, onReady]);
    return <div data-testid="inner" />;
}

// ──────────────────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────────────────

describe('SessionMonitorProvider', () => {
    let mockUpdate: jest.Mock;

    beforeEach(() => {
        jest.useFakeTimers();
        mockUpdate = jest.fn().mockResolvedValue(undefined);
        (usePathname as jest.Mock).mockReturnValue('/dashboard');
        (signOut as jest.Mock).mockResolvedValue(undefined);
        (navigateTo as jest.Mock).mockImplementation(() => {});
        fetchMock.resetMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
        cleanup();
        jest.clearAllMocks();
    });

    // ── (1) Timer fires ~60 s before token expiry ──────────────────────────

    it('(1) schedules a timer that fires ~60 s before token expiry', async () => {
        // Expiry 90 s from now → timer delay = 90_000 − 60_000 = 30_000 ms
        const expiry = new Date(Date.now() + 90_000).toISOString();
        (useSession as jest.Mock).mockReturnValue({
            data: { user: makeUser({ rucioAuthTokenExpires: expiry, rucioAuthType: AuthType.OIDC }) },
            status: 'authenticated',
            update: mockUpdate,
        });
        fetchMock.mockResponse(JSON.stringify({ success: true }));

        render(
            <SessionMonitorProvider>
                <div />
            </SessionMonitorProvider>,
        );

        // Timer has not fired yet
        expect(fetchMock).not.toHaveBeenCalled();

        // Advance to just before the fire point (30_000 − 1 ms)
        await act(async () => {
            jest.advanceTimersByTime(29_999);
        });
        expect(fetchMock).not.toHaveBeenCalled();

        // Cross the threshold
        await act(async () => {
            jest.advanceTimersByTime(2);
        });
        expect(fetchMock).toHaveBeenCalledWith('/api/auth/refresh', { method: 'POST' });
    });

    // ── (2) Successful OIDC refresh calls update() and enables re-scheduling

    it('(2) calls update() after a successful refresh and reschedules for the new expiry', async () => {
        const expiry = new Date(Date.now() + 90_000).toISOString();
        const newExpiry = new Date(Date.now() + 180_000).toISOString();

        (useSession as jest.Mock).mockReturnValue({
            data: { user: makeUser({ rucioAuthTokenExpires: expiry, rucioAuthType: AuthType.OIDC }) },
            status: 'authenticated',
            update: mockUpdate,
        });
        fetchMock.mockResponse(JSON.stringify({ success: true }));

        const { rerender } = render(
            <SessionMonitorProvider>
                <div />
            </SessionMonitorProvider>,
        );

        // Fire the first timer (delay = 30_000 ms)
        await act(async () => {
            jest.advanceTimersByTime(30_001);
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        // update() must have been called so the session re-renders with the new expiry
        expect(mockUpdate).toHaveBeenCalledTimes(1);

        // Simulate the session updating with a new expiry after the cookie refresh
        fetchMock.resetMocks();
        fetchMock.mockResponse(JSON.stringify({ success: true }));
        (useSession as jest.Mock).mockReturnValue({
            data: { user: makeUser({ rucioAuthTokenExpires: newExpiry, rucioAuthType: AuthType.OIDC }) },
            status: 'authenticated',
            update: mockUpdate,
        });

        await act(async () => {
            rerender(
                <SessionMonitorProvider>
                    <div />
                </SessionMonitorProvider>,
            );
        });

        // A new timer should have been scheduled (delay = 180_000 − 60_000 = 120_000 ms)
        await act(async () => {
            jest.advanceTimersByTime(120_001);
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // ── (3) Failed refresh calls signOut() but NOT update() ───────────────

    it('(3) calls signOut() but not update() when the refresh API returns success:false', async () => {
        const expiry = new Date(Date.now() + 90_000).toISOString();
        (useSession as jest.Mock).mockReturnValue({
            data: { user: makeUser({ rucioAuthTokenExpires: expiry, rucioAuthType: AuthType.OIDC }) },
            status: 'authenticated',
            update: mockUpdate,
        });
        fetchMock.mockResponse(JSON.stringify({ success: false, error: 'OIDC provider returned no access token' }));

        render(
            <SessionMonitorProvider>
                <div />
            </SessionMonitorProvider>,
        );

        await act(async () => {
            jest.advanceTimersByTime(30_001);
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(mockUpdate).not.toHaveBeenCalled();
        // signOut must be called so NextAuth transitions to 'unauthenticated',
        // allowing the redirect watcher to fire with ?expired=true.
        expect(signOut).toHaveBeenCalledWith({ redirect: false });
    });

    // ── (4) Natural expiry → redirect with ?expired=true ──────────────────

    it('(4) redirects to /auth/login?expired=true after a natural session expiry', async () => {
        // Start authenticated so wasAuthenticatedRef becomes true
        (useSession as jest.Mock).mockReturnValue({
            data: { user: makeUser() },
            status: 'authenticated',
            update: mockUpdate,
        });

        const { rerender } = render(
            <SessionMonitorProvider>
                <div />
            </SessionMonitorProvider>,
        );

        // Session expires naturally
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: 'unauthenticated',
            update: mockUpdate,
        });

        await act(async () => {
            rerender(
                <SessionMonitorProvider>
                    <div />
                </SessionMonitorProvider>,
            );
            // Flush the signOut promise resolution
            await Promise.resolve();
        });

        expect(signOut).toHaveBeenCalledWith({ redirect: false });
        const redirectArg: string = (navigateTo as jest.Mock).mock.calls[0][0];
        expect(redirectArg).toMatch(/^\/auth\/login\?expired=true/);
        expect(redirectArg).toContain('callbackUrl=');
        // Must NOT be a plain /auth/login redirect
        expect(redirectArg).not.toBe('/auth/login');
    });

    // ── (5) manualSignOut → redirect WITHOUT ?expired=true ────────────────

    it('(5) manualSignOut() calls signOut and redirects to /auth/login without ?expired=true', async () => {
        (useSession as jest.Mock).mockReturnValue({
            data: { user: makeUser() },
            status: 'authenticated',
            update: mockUpdate,
        });

        let capturedManualSignOut: (() => Promise<void>) | undefined;

        render(
            <SessionMonitorProvider>
                <ManualSignOutConsumer onReady={fn => { capturedManualSignOut = fn; }} />
            </SessionMonitorProvider>,
        );

        await act(async () => {
            await capturedManualSignOut?.();
        });

        expect(signOut).toHaveBeenCalledWith({ redirect: false });
        expect(navigateTo).toHaveBeenCalledWith('/auth/login?signedOut=true');
        const allUrls = (navigateTo as jest.Mock).mock.calls.map(([url]: [string]) => url);
        expect(allUrls.every((url: string) => !url.includes('expired=true'))).toBe(true);
    });

    // ── (6) userpass auth type: opens in-place re-auth modal (#628) ───────

    it('(6) opens the in-place re-auth modal for userpass auth type — does NOT signOut/redirect', async () => {
        const expiry = new Date(Date.now() + 90_000).toISOString();
        (useSession as jest.Mock).mockReturnValue({
            data: {
                user: makeUser({
                    rucioAuthType: AuthType.USERPASS,
                    rucioAuthTokenExpires: expiry,
                }),
            },
            status: 'authenticated',
            update: mockUpdate,
        });

        const { findByRole } = render(
            <SessionMonitorProvider>
                <div />
            </SessionMonitorProvider>,
        );

        // Advance well past the timer fire point
        await act(async () => {
            jest.advanceTimersByTime(30_001);
        });

        // userpass cannot be refreshed server-side, so no refresh API call,
        // no update().
        expect(fetchMock).not.toHaveBeenCalled();
        expect(mockUpdate).not.toHaveBeenCalled();
        // #628: we open the re-auth modal in place rather than tearing down
        // the session — signOut and the expired-redirect must NOT fire.
        expect(signOut).not.toHaveBeenCalled();
        expect(navigateTo).not.toHaveBeenCalled();
        // The modal renders with a "Session expired" heading.
        const heading = await findByRole('heading', { name: /session expired/i });
        expect(heading).toBeInTheDocument();
    });
});
