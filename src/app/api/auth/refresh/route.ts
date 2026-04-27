import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { auth } from '@/lib/infrastructure/auth/auth';
import { AuthType } from '@/lib/core/entity/auth-models';
import type { SessionUser } from '@/types/next-auth';
import { refreshOidcToken } from '@/lib/infrastructure/auth/oidc-token-refresh-service';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import type EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';

function getSessionCookieConfig(): { cookieName: string; isSecure: boolean } {
    const isSecure = process.env.NEXTAUTH_URL?.startsWith('https://') ?? false;
    const cookieName = isSecure ? '__Secure-authjs.session-token' : 'authjs.session-token';
    return { cookieName, isSecure };
}

/**
 * POST /api/auth/refresh
 *
 * Attempts to silently refresh the Rucio auth token before it expires.
 * Cookie persistence is delegated to NextAuth's `unstable_update`, which
 * invokes the `jwt` callback with trigger='update' and writes the session
 * cookie (with chunking) through NextAuth's own mechanism.
 *
 * Responses:
 *   200  { success: true, newExpiry }    — token refreshed; Set-Cookie updated
 *   200  { success: false, error }       — refresh not possible or upstream failure
 *   401  { success: false, error }       — no authenticated session
 *   500  { success: false, error }       — server configuration error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const nextAuthSecret = process.env.NEXTAUTH_SECRET;
        if (!nextAuthSecret) {
            console.error('[Refresh] NEXTAUTH_SECRET is not configured');
            return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
        }

        const session = await auth();
        if (!session?.user?.isLoggedIn) {
            return NextResponse.json({ success: false, error: 'No active session' }, { status: 401 });
        }

        const sessionUser = session.user;
        const authType = String(sessionUser.rucioAuthType ?? '').toLowerCase();

        if (authType === AuthType.USERPASS) {
            return NextResponse.json({
                success: false,
                error: 'Userpass sessions rely on natural token expiry; please sign in again',
            });
        }

        if (authType === AuthType.x509) {
            return handleX509Refresh(sessionUser);
        }

        if (authType === AuthType.OIDC) {
            // Dev-only: force refresh failure to exercise the expired-session redirect path.
            if (process.env.DEV_FORCE_REFRESH_FAIL === 'true') {
                console.log('[Refresh] DEV_FORCE_REFRESH_FAIL is set — returning forced failure');
                return NextResponse.json({ success: false, error: 'Forced failure (DEV_FORCE_REFRESH_FAIL)' });
            }
            return handleOIDCRefresh(request, sessionUser, nextAuthSecret);
        }

        return NextResponse.json({ success: false, error: `Unsupported auth type: '${authType}'` });
    } catch (error) {
        console.error('[Refresh] Unexpected error during token refresh:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * x509 session refresh.
 *
 * Rucio x509 authentication requires the browser to present a TLS client
 * certificate directly to the Rucio auth endpoint; server-side renewal is
 * architecturally impossible. Returning `success:false` causes the client
 * SessionMonitor to fall through to the redirect path.
 */
function handleX509Refresh(user: SessionUser): NextResponse {
    console.log(
        `[Refresh] x509 refresh attempted for account: ${user.rucioAccount}. ` +
            'Server-side x509 renewal requires browser certificate presentation — returning failure.',
    );
    return NextResponse.json({
        success: false,
        error: 'x509 token renewal requires browser certificate presentation; please sign in again',
    });
}

async function handleOIDCRefresh(request: NextRequest, user: SessionUser, nextAuthSecret: string): Promise<NextResponse> {
    console.log(`[Refresh] OIDC refresh initiated — account: ${user.rucioAccount}, provider: ${user.rucioOIDCProvider}`);

    const { cookieName, isSecure } = getSessionCookieConfig();

    // Refresh token is a server-side secret — always read from the JWT cookie.
    const jwtToken = await getToken({
        req: request,
        secret: nextAuthSecret,
        secureCookie: isSecure,
        cookieName,
        salt: cookieName,
    });

    if (!jwtToken) {
        console.error('[Refresh] Could not decode JWT from session cookie');
        return NextResponse.json({ success: false, error: 'Could not read session token' });
    }

    const refreshToken = jwtToken.rucioOidcRefreshToken as string | undefined;
    if (!refreshToken) {
        console.warn('[Refresh] No OIDC refresh token found in JWT');
        return NextResponse.json({ success: false, error: 'No OIDC refresh token available' });
    }

    const providerName = user.rucioOIDCProvider;
    if (!providerName) {
        return NextResponse.json({ success: false, error: 'No OIDC provider name stored in session' });
    }

    const envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);

    const result = await refreshOidcToken({ refreshToken, providerName, envConfigGateway });

    if (!result.success) {
        return NextResponse.json({ success: false, error: result.error });
    }

    // Delegate cookie persistence to NextAuth. `update` invokes the jwt
    // callback with trigger='update' and the payload below; NextAuth then
    // re-encodes the JWT and writes the session cookie (with chunking)
    // to the outgoing response.
    // Access `update` via require — SWC doesn't wire up the renamed
    // destructured export (`{ unstable_update: update }`) for ESM named
    // imports, so `import { update }` resolves to undefined at runtime.
    const { update } = require('@/lib/infrastructure/auth/auth') as { update: (data: unknown) => Promise<unknown> };
    await update({
        rucioAuthToken: result.rucioAuthToken,
        rucioAuthTokenExpires: result.rucioAuthTokenExpires,
        rucioOidcRefreshToken: result.rucioOidcRefreshToken,
    } as never);

    console.log(`[Refresh] OIDC session refreshed for account: ${user.rucioAccount}, expires: ${result.rucioAuthTokenExpires}`);
    return NextResponse.json({ success: true, newExpiry: result.rucioAuthTokenExpires });
}
