/**
 * @jest-environment jsdom
 *
 * Unit tests for switchX509Account (src/lib/infrastructure/auth/x509-switch.ts).
 *
 * The helper is the user-facing half of #628's lazy-mint design for x509: the
 * dropdown calls it on a "switch to X" click for the active x509 identity.
 * It hits Rucio's /auth/x509/webui directly (browser presents the cert
 * automatically) with X-Rucio-Account=target, then forwards the resulting
 * token to NextAuth via signIn('x509', ...).
 *
 * Coverage:
 * (a) Missing rucioAuthHost → returns error
 * (b) Successful switch: fetch sees correct headers; signIn called with the
 *     headers Rucio returned
 * (c) Rucio returns 401 → error
 * (d) Rucio returns non-200 → error
 * (e) Missing X-Rucio-Auth-Token header → error
 * (f) signIn returns ok=false → error propagated
 * (g) fetch throws → error propagated
 */

// The api jest project maps `next-auth/*` to a shared mock module that has no
// named `signIn` export, so we provide a focused inline factory here.
jest.mock('next-auth/react', () => ({
    __esModule: true,
    signIn: jest.fn(),
}));

import { signIn } from 'next-auth/react';
import { switchX509Account } from '@/lib/infrastructure/auth/x509-switch';

beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
});

describe('switchX509Account', () => {
    it('(a) returns error if rucioAuthHost is empty', async () => {
        const result = await switchX509Account({ rucioAuthHost: '', targetAccount: 'atlas', shortVOName: 'def' });
        expect(result.ok).toBe(false);
        expect(fetchMock).not.toHaveBeenCalled();
        expect(signIn).not.toHaveBeenCalled();
    });

    it('(b) successful switch: fetch carries account header, signIn forwards token', async () => {
        fetchMock.mockResponseOnce('', {
            status: 200,
            headers: {
                'X-Rucio-Auth-Token': 'tok-atlas',
                'X-Rucio-Auth-Token-Expires': '2030-01-01T00:00:00Z',
                'X-Rucio-Auth-Account': 'atlas',
            },
        });
        (signIn as jest.Mock).mockResolvedValue({ ok: true });

        const result = await switchX509Account({
            rucioAuthHost: 'https://rucio-auth.example/auth',
            targetAccount: 'atlas',
            shortVOName: 'def',
        });

        expect(result).toEqual({ ok: true });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('https://rucio-auth.example/auth/auth/x509/webui');
        expect(init?.method).toBe('GET');
        expect(init?.credentials).toBe('include');
        const headers = init?.headers as Headers;
        expect(headers.get('X-Rucio-Account')).toBe('atlas');
        expect(headers.get('X-Rucio-VO')).toBe('def');
        expect(headers.get('X-Rucio-AppID')).toBe('rucio-webui');

        expect(signIn).toHaveBeenCalledWith('x509', {
            rucioAuthToken: 'tok-atlas',
            rucioAccount: 'atlas',
            shortVOName: 'def',
            rucioTokenExpiry: '2030-01-01T00:00:00Z',
            redirect: false,
        });
    });

    it('(c) Rucio returns 401 → cert-rejected error', async () => {
        fetchMock.mockResponseOnce('', { status: 401 });
        const result = await switchX509Account({ rucioAuthHost: 'https://r', targetAccount: 'atlas', shortVOName: 'def' });
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error).toMatch(/certificate.*rejected/i);
        expect(signIn).not.toHaveBeenCalled();
    });

    it('(d) Rucio returns non-200 → status-code error', async () => {
        fetchMock.mockResponseOnce('', { status: 503 });
        const result = await switchX509Account({ rucioAuthHost: 'https://r', targetAccount: 'atlas', shortVOName: 'def' });
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error).toMatch(/503/);
    });

    it('(e) Missing X-Rucio-Auth-Token header → error', async () => {
        fetchMock.mockResponseOnce('', {
            status: 200,
            headers: {
                'X-Rucio-Auth-Token-Expires': '2030-01-01T00:00:00Z',
                'X-Rucio-Auth-Account': 'atlas',
            },
        });
        const result = await switchX509Account({ rucioAuthHost: 'https://r', targetAccount: 'atlas', shortVOName: 'def' });
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error).toMatch(/missing.*header/i);
        expect(signIn).not.toHaveBeenCalled();
    });

    it('(f) signIn returns ok=false → error propagated', async () => {
        fetchMock.mockResponseOnce('', {
            status: 200,
            headers: {
                'X-Rucio-Auth-Token': 'tok-atlas',
                'X-Rucio-Auth-Token-Expires': '2030-01-01T00:00:00Z',
                'X-Rucio-Auth-Account': 'atlas',
            },
        });
        (signIn as jest.Mock).mockResolvedValue({ ok: false, error: 'CredentialsSignin' });
        const result = await switchX509Account({ rucioAuthHost: 'https://r', targetAccount: 'atlas', shortVOName: 'def' });
        expect(result).toEqual({ ok: false, error: 'CredentialsSignin' });
    });

    it('(g) fetch throws → error propagated', async () => {
        fetchMock.mockReject(new Error('network down'));
        const result = await switchX509Account({ rucioAuthHost: 'https://r', targetAccount: 'atlas', shortVOName: 'def' });
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error).toMatch(/network down/);
    });
});
