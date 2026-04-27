import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import type AuthServerGatewayOutputPort from '@/lib/core/port/secondary/auth-server-gateway-output-port';
import type AccountGatewayOutputPort from '@/lib/core/port/secondary/account-gateway-output-port';

/**
 * After Rucio returns 200 with a (possibly auto-selected default) account, looks up
 * every other account mapped to the same identity. Returns just the account *names*
 * with no tokens. The dropdown uses this list to surface "switch to X" options that
 * trigger a fresh re-auth (#628 lazy-mint design); we do NOT silently mint bearer
 * tokens for accounts the user did not explicitly choose to use.
 *
 * Failures are non-fatal; the primary login still succeeds with an empty list.
 */
async function getIdentityAccountNames(
    username: string,
    rucioAuthToken: string,
    accountGateway: AccountGatewayOutputPort,
): Promise<string[]> {
    const result = await accountGateway.listAccountsForIdentity(username, 'userpass', rucioAuthToken);
    if (result.status !== 'success') {
        return [];
    }
    return result.accounts;
}

/**
 * POST /api/auth/userpass/probe
 *
 * Server-side probe of Rucio's /auth/userpass endpoint. The Rucio endpoint
 * isn't browser-facing (no CORS), so the client can't hit it directly
 * this route wraps it and returns a small JSON payload the Login page can
 * treat like an AuthViewModel (success / multiple_accounts / error).
 *
 * On 200 (default/single account), the route additionally returns
 * `linkedAccountNames`: every other account mapped to the same identity.
 * No tokens for those accounts are minted at this point; the user must
 * re-enter their password to switch into them (#628 lazy-mint design).
 *
 * Session is established afterwards by signIn('userpass', { rucioAuthToken, ... }),
 * which triggers the credentials provider's authorize() in NextAuth.
 */
export async function POST(request: NextRequest) {
    let body: { username?: string; password?: string; vo?: string; account?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ status: 'error', message: 'Invalid request body' }, { status: 400 });
    }

    const { username, password, vo, account } = body;
    if (!username || !password || !vo) {
        return NextResponse.json({ status: 'error', message: 'username, password and vo are required' }, { status: 400 });
    }

    try {
        const authServer = appContainer.get<AuthServerGatewayOutputPort>(GATEWAYS.AUTH_SERVER);
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT);
        const dto = await authServer.userpassLogin(username, password, account ?? '', vo);

        if (dto.statusCode === 200) {
            const linkedAccountNames = await getIdentityAccountNames(username, dto.authToken!, accountGateway);
            return NextResponse.json({
                status: 'success',
                rucioAuthToken: dto.authToken,
                rucioAccount: dto.account,
                rucioAuthTokenExpires: dto.authTokenExpires,
                linkedAccountNames,
            });
        }

        if (dto.statusCode === 206) {
            // Gateway stuffs the comma-separated X-Rucio-Auth-Accounts into `message` on 206.
            return NextResponse.json({
                status: 'multiple_accounts',
                accounts: dto.message,
            });
        }

        return NextResponse.json(
            {
                status: 'error',
                message: dto.message || 'Authentication failed',
            },
            { status: dto.statusCode >= 400 && dto.statusCode < 600 ? dto.statusCode : 500 },
        );
    } catch (error) {
        console.error('[userpass/probe] Unexpected error:', error);
        return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
    }
}
