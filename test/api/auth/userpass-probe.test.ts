/**
 * Unit tests for POST /api/auth/userpass/probe (src/app/api/auth/userpass/probe/route.ts).
 *
 * The probe route wraps Rucio's /auth/userpass for the browser (which can't hit
 * it directly due to CORS) and, on a successful 200, additionally returns the
 * names of every other account mapped to the same identity (#628 lazy-mint).
 *
 * No tokens for those linked accounts are minted here; the dropdown surfaces
 * them with a re-auth modal trigger, and the modal calls this same route with
 * the target account explicitly to obtain a fresh token.
 *
 * Coverage:
 * (a) Missing required fields → 400
 * (b) 200 single-account → linkedAccountNames: [primary]
 * (c) 200 + identity maps to multiple accounts → all names returned, no tokens
 * (d) 200 + listAccountsForIdentity error → empty linkedAccountNames; primary still succeeds
 * (e) 206 → multiple_accounts (no identity-account lookup attempted)
 * (f) Auth server error → propagated status code
 * (g) 200 with explicit `account` param (re-auth/switch flow) → returns names; no extra calls
 */

const userpassLoginMock = jest.fn();
const listAccountsForIdentityMock = jest.fn();

jest.mock('@/lib/infrastructure/ioc/container-config', () => {
    const GATEWAYS = jest.requireActual('@/lib/infrastructure/ioc/ioc-symbols-gateway').default;
    return {
        __esModule: true,
        default: {
            get: jest.fn((symbol: symbol) => {
                if (symbol === GATEWAYS.AUTH_SERVER) {
                    return { userpassLogin: userpassLoginMock };
                }
                if (symbol === GATEWAYS.ACCOUNT) {
                    return { listAccountsForIdentity: listAccountsForIdentityMock };
                }
                throw new Error(`Unexpected IoC symbol in test: ${String(symbol)}`);
            }),
        },
    };
});

if (typeof (global.Response as any).json !== 'function') {
    (global.Response as any).json = function jsonPolyfill(data: unknown, init?: ResponseInit): Response {
        return new Response(JSON.stringify(data), {
            ...init,
            headers: {
                'content-type': 'application/json',
                ...(init?.headers instanceof Headers
                    ? Object.fromEntries((init.headers as Headers).entries())
                    : (init?.headers ?? {})),
            },
        });
    };
}

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/userpass/probe/route';

function makeRequest(body: unknown): NextRequest {
    return new NextRequest('http://localhost:3000/api/auth/userpass/probe', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'content-type': 'application/json' },
    });
}

describe('POST /api/auth/userpass/probe', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('(a) returns 400 when required fields are missing', async () => {
        const res = await POST(makeRequest({ username: 'ddmlab', vo: 'def' }));
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.status).toBe('error');
    });

    it('(b) returns success with single-element linkedAccountNames when identity has only the default account', async () => {
        userpassLoginMock.mockResolvedValueOnce({
            statusCode: 200,
            authToken: 'tok-root',
            account: 'root',
            authTokenExpires: '2030-01-01T00:00:00Z',
        });
        listAccountsForIdentityMock.mockResolvedValueOnce({ status: 'success', accounts: ['root'] });

        const res = await POST(makeRequest({ username: 'ddmlab', password: 'pw', vo: 'def' }));

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body).toEqual({
            status: 'success',
            rucioAuthToken: 'tok-root',
            rucioAccount: 'root',
            rucioAuthTokenExpires: '2030-01-01T00:00:00Z',
            linkedAccountNames: ['root'],
        });
        // Single primary login + single identity-lookup. No extra userpassLogin calls
        // (lazy-mint design: no per-account token issuance here).
        expect(userpassLoginMock).toHaveBeenCalledTimes(1);
    });

    it('(c) #628: returns ALL identity account names alongside primary login; no extra tokens minted', async () => {
        userpassLoginMock.mockResolvedValueOnce({
            statusCode: 200,
            authToken: 'tok-root',
            account: 'root',
            authTokenExpires: '2030-01-01T00:00:00Z',
        });
        listAccountsForIdentityMock.mockResolvedValueOnce({ status: 'success', accounts: ['root', 'atlas', 'cms'] });

        const res = await POST(makeRequest({ username: 'ddmlab', password: 'pw', vo: 'def' }));

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.status).toBe('success');
        expect(body.rucioAccount).toBe('root');
        expect(body.linkedAccountNames).toEqual(['root', 'atlas', 'cms']);
        // Crucial: no per-account token issuance. Switching is re-prompted later.
        expect(userpassLoginMock).toHaveBeenCalledTimes(1);
    });

    it('(d) primary login still succeeds with empty linkedAccountNames if identity-account lookup fails', async () => {
        userpassLoginMock.mockResolvedValueOnce({
            statusCode: 200,
            authToken: 'tok-root',
            account: 'root',
            authTokenExpires: '2030-01-01T00:00:00Z',
        });
        listAccountsForIdentityMock.mockResolvedValueOnce({ status: 'error', accounts: [], message: 'HTTP 500' });

        const res = await POST(makeRequest({ username: 'ddmlab', password: 'pw', vo: 'def' }));

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.status).toBe('success');
        expect(body.linkedAccountNames).toEqual([]);
    });

    it('(e) forwards 206 multiple-accounts response without an identity-account lookup', async () => {
        userpassLoginMock.mockResolvedValueOnce({
            statusCode: 206,
            message: 'root,atlas,cms',
        });

        const res = await POST(makeRequest({ username: 'ddmlab', password: 'pw', vo: 'def' }));

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body).toEqual({ status: 'multiple_accounts', accounts: 'root,atlas,cms' });
        expect(listAccountsForIdentityMock).not.toHaveBeenCalled();
    });

    it('(f) returns the upstream auth-server error code on failure', async () => {
        userpassLoginMock.mockResolvedValueOnce({
            statusCode: 401,
            message: 'Invalid credentials',
        });

        const res = await POST(makeRequest({ username: 'ddmlab', password: 'pw', vo: 'def' }));

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body.status).toBe('error');
        expect(body.message).toBe('Invalid credentials');
    });

    it('(g) re-auth/switch flow: explicit `account` param returns names; no extra userpassLogin calls', async () => {
        userpassLoginMock.mockResolvedValueOnce({
            statusCode: 200,
            authToken: 'tok-atlas',
            account: 'atlas',
            authTokenExpires: '2030-01-01T00:00:00Z',
        });
        listAccountsForIdentityMock.mockResolvedValueOnce({ status: 'success', accounts: ['root', 'atlas', 'cms'] });

        const res = await POST(makeRequest({ username: 'ddmlab', password: 'pw', vo: 'def', account: 'atlas' }));

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.rucioAccount).toBe('atlas');
        expect(body.linkedAccountNames).toEqual(['root', 'atlas', 'cms']);
        // The probe was called with account='atlas'; no other userpassLogin calls.
        expect(userpassLoginMock).toHaveBeenCalledTimes(1);
        expect(userpassLoginMock.mock.calls[0][2]).toBe('atlas');
    });
});
