import { signIn } from 'next-auth/react';

/**
 * Result of a silent x509 account switch attempt.
 *
 * - `ok: true`   → the new account is now the active session (a page reload
 *                  is the caller's responsibility; see AccountButton).
 * - `ok: false`  → switching failed; `error` is a user-facing message.
 */
export type X509SwitchResult = { ok: true } | { ok: false; error: string };

/**
 * Mints a fresh Rucio token for a different account on the same x509 identity
 * and establishes a new NextAuth session for it.
 *
 * The browser presents the user's client certificate automatically when
 * fetching Rucio's `/auth/x509/webui`, so unlike userpass we do NOT need to
 * prompt for credentials; the cert IS the credential. We pass the chosen
 * account via `X-Rucio-Account` so Rucio scopes the token correctly.
 *
 * This is the lazy-mint switch path for x509 (#628): no tokens are pre-minted
 * for linked accounts at login; each switch issues its own. Keeps the session
 * cookie at one bearer token at a time.
 */
export async function switchX509Account(opts: { rucioAuthHost: string; targetAccount: string; shortVOName: string }): Promise<X509SwitchResult> {
    const { rucioAuthHost, targetAccount, shortVOName } = opts;
    if (!rucioAuthHost) {
        return { ok: false, error: 'Rucio auth host is not configured' };
    }

    const url = `${rucioAuthHost}/auth/x509/webui`;
    const headers = new Headers({
        'X-Rucio-VO': shortVOName,
        'X-Rucio-AppID': 'rucio-webui',
        'X-Rucio-Account': targetAccount,
    });

    let res: Response;
    try {
        res = await fetch(url, { method: 'GET', headers, credentials: 'include' });
    } catch (error) {
        return { ok: false, error: `Failed to reach Rucio auth host: ${(error as Error).message}` };
    }

    if (res.status === 401) {
        return { ok: false, error: 'x509 certificate was rejected by Rucio' };
    }
    if (res.status !== 200) {
        return { ok: false, error: `Rucio returned ${res.status} during x509 switch` };
    }

    const rucioAuthToken = res.headers.get('X-Rucio-Auth-Token');
    const rucioAuthTokenExpires = res.headers.get('X-Rucio-Auth-Token-Expires');
    const rucioAccount = res.headers.get('X-Rucio-Auth-Account');
    if (!rucioAuthToken || !rucioAuthTokenExpires || !rucioAccount) {
        return { ok: false, error: 'x509 response missing required headers' };
    }

    const result = await signIn('x509', {
        rucioAuthToken,
        rucioAccount,
        shortVOName,
        rucioTokenExpiry: rucioAuthTokenExpires,
        redirect: false,
    });

    if (result?.ok) {
        return { ok: true };
    }
    return { ok: false, error: result?.error || 'NextAuth signIn failed' };
}
