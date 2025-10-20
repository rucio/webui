# IronSession to NextAuth Migration Plan

## Executive Summary

This document outlines the detailed migration strategy from IronSession to NextAuth.js while preserving the existing session structure, multi-account support, and authentication methods (UserPass and x509).

## Current Architecture Overview

### Session Structure
```typescript
interface IronSessionData {
  user?: SessionUser;      // Currently active user
  allUsers?: SessionUser[]; // All logged-in users (multi-account support)
}

interface SessionUser {
  rucioIdentity: string;
  rucioAccount: string;
  rucioAuthType: AuthType | null;
  rucioAuthToken: string;
  rucioAuthTokenExpires: string;
  rucioOIDCProvider: string | null;
  rucioVO: string;
  role: Role;
  isLoggedIn: boolean;
}
```

### Current Authentication Flows

#### 1. UserPass Authentication
```
Client → /api/auth/userpass
       → UserPassLoginController
       → UserPassLoginUseCase
       → Rucio Auth Server (/auth/userpass)
       → Returns token
       → Sets session via IronSession
       → Redirects to dashboard
```

#### 2. x509 Authentication (Two-Step Process)
```
Step 1: Client → Rucio Auth Server (/auth/x509/webui) [with client cert]
       → Returns token in headers
       → Client extracts token from headers

Step 2: Client → /api/auth/x509 (with token)
       → SetX509LoginSessionController
       → SetX509LoginSessionUseCase
       → Sets session via IronSession
       → Redirects to dashboard
```

#### 3. Key Features
- Multi-account support (multiple simultaneous logins)
- Account switching via `/api/auth/switch`
- Token expiration validation in middleware
- Clean hexagonal architecture with Inversify IoC

## Migration Strategy

### Phase 1: Setup and Configuration

#### 1.1 Install NextAuth.js v5 (Auth.js)
```bash
npm install next-auth@beta @auth/core
```

**Rationale:** NextAuth v5 has better TypeScript support, App Router integration, and more flexible configuration.

#### 1.2 Create NextAuth Configuration File
**File:** `src/lib/infrastructure/auth/auth.config.ts`

```typescript
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SessionUser, AuthType, Role } from '@/lib/core/entity/auth-models';

declare module 'next-auth' {
  interface Session {
    user: SessionUser;
    allUsers: SessionUser[];
  }

  interface User extends SessionUser {}
}

declare module '@auth/core/jwt' {
  interface JWT {
    user: SessionUser;
    allUsers: SessionUser[];
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    // UserPass provider
    CredentialsProvider({
      id: 'userpass',
      name: 'Rucio UserPass',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        account: { label: 'Account', type: 'text' },
        vo: { label: 'VO', type: 'text' },
      },
      async authorize(credentials) {
        // Calls your existing UserPassLoginUseCase
        // Returns SessionUser object or null
      },
    }),

    // x509 provider (custom)
    CredentialsProvider({
      id: 'x509',
      name: 'Rucio x509',
      credentials: {
        rucioAuthToken: { type: 'text' },
        rucioAccount: { type: 'text' },
        shortVOName: { type: 'text' },
        rucioTokenExpiry: { type: 'text' },
      },
      async authorize(credentials) {
        // Calls your existing SetX509LoginSessionUseCase
        // Returns SessionUser object or null
      },
    }),
  ],

  pages: {
    signIn: '/auth/login',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Handle multi-account logic
      if (user) {
        // New login: add or update user
        if (!token.allUsers) {
          token.allUsers = [];
        }

        const existingIndex = token.allUsers.findIndex(
          u => u.rucioIdentity === user.rucioIdentity &&
               u.rucioAccount === user.rucioAccount &&
               u.rucioAuthType === user.rucioAuthType
        );

        if (existingIndex === -1) {
          token.allUsers.push(user as SessionUser);
        } else {
          token.allUsers[existingIndex] = user as SessionUser;
        }

        token.user = user as SessionUser;
      }

      // Handle account switching
      if (trigger === 'update' && session?.account) {
        const switchUser = token.allUsers?.find(
          u => u.rucioAccount === session.account
        );
        if (switchUser) {
          token.user = switchUser;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      session.allUsers = token.allUsers || [];
      return session;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
};
```

#### 1.3 Create NextAuth Route Handler
**File:** `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/infrastructure/auth/auth.config';

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
```

### Phase 2: Implement Authentication Providers

#### 2.1 UserPass Credentials Provider

**Strategy:** Wrap your existing `UserPassLoginUseCase` in the NextAuth authorize function.

**Implementation Steps:**

1. **Create a bridge adapter** that calls your existing use case:

```typescript
// src/lib/infrastructure/auth/nextauth-userpass-adapter.ts
import { SessionUser, AuthType, Role } from '@/lib/core/entity/auth-models';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { IUserPassLoginController } from '@/lib/infrastructure/controller/userpass-login-controller';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';

export async function authorizeUserPass(
  username: string,
  password: string,
  account: string,
  vo: string
): Promise<SessionUser | null> {
  return new Promise((resolve, reject) => {
    // Create a custom response handler (Signal)
    const responseHandler = {
      presentSuccess: (response: any) => {
        const sessionUser: SessionUser = {
          rucioIdentity: response.rucioIdentity,
          rucioAccount: response.rucioAccount,
          rucioAuthType: AuthType.USERPASS,
          rucioAuthToken: response.rucioAuthToken,
          rucioAuthTokenExpires: response.rucioAuthTokenExpires,
          rucioOIDCProvider: null,
          rucioVO: response.vo,
          role: response.role || Role.USER,
          isLoggedIn: true,
        };
        resolve(sessionUser);
      },
      presentError: (error: any) => {
        console.error('UserPass login error:', error);
        resolve(null);
      },
      presentIncomplete: (incomplete: any) => {
        // Handle multiple accounts scenario
        console.log('Multiple accounts available:', incomplete.availableAccounts);
        resolve(null);
      },
    };

    // Call your existing use case
    const controller = appContainer.get<IUserPassLoginController>(CONTROLLERS.USERPASS_LOGIN);

    // Create a mock session object (not needed for NextAuth)
    const mockSession = {} as any;

    controller.handle(username, password, account, vo, mockSession, responseHandler, '/dashboard');
  });
}
```

2. **Update the authorize function** in auth.config.ts:

```typescript
CredentialsProvider({
  id: 'userpass',
  name: 'Rucio UserPass',
  credentials: {
    username: { label: 'Username', type: 'text' },
    password: { label: 'Password', type: 'password' },
    account: { label: 'Account', type: 'text' },
    vo: { label: 'VO', type: 'text' },
  },
  async authorize(credentials) {
    if (!credentials?.username || !credentials?.password) {
      return null;
    }

    return await authorizeUserPass(
      credentials.username as string,
      credentials.password as string,
      credentials.account as string,
      credentials.vo as string
    );
  },
}),
```

#### 2.2 x509 Custom Flow (Complex)

**Challenge:** x509 requires client certificate authentication, which happens in the browser before NextAuth is involved.

**Solution: Two-Step Hybrid Approach**

**Step 1:** Keep the frontend direct call to Rucio (unchanged)
- Frontend calls Rucio x509 endpoint directly with client cert
- Receives token in response headers

**Step 2:** Use NextAuth signIn with custom provider
- Instead of calling `/api/auth/x509`, call NextAuth's signIn
- Pass the token and account info to NextAuth

**Implementation:**

1. **Create x509 adapter:**

```typescript
// src/lib/infrastructure/auth/nextauth-x509-adapter.ts
import { SessionUser, AuthType, Role } from '@/lib/core/entity/auth-models';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { ISetX509LoginSessionController } from '@/lib/infrastructure/controller/set-x509-login-session-controller';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';

export async function authorizeX509(
  rucioAuthToken: string,
  rucioAccount: string,
  shortVOName: string,
  rucioTokenExpiry: string
): Promise<SessionUser | null> {
  return new Promise((resolve, reject) => {
    const responseHandler = {
      presentSuccess: (response: any) => {
        const sessionUser: SessionUser = {
          rucioIdentity: response.rucioIdentity,
          rucioAccount: response.rucioAccount,
          rucioAuthType: AuthType.x509,
          rucioAuthToken: response.rucioAuthToken,
          rucioAuthTokenExpires: response.rucioAuthTokenExpires,
          rucioOIDCProvider: null,
          rucioVO: response.vo.shortName,
          role: response.role || Role.USER,
          isLoggedIn: true,
        };
        resolve(sessionUser);
      },
      presentError: (error: any) => {
        console.error('x509 login error:', error);
        resolve(null);
      },
    };

    const controller = appContainer.get<ISetX509LoginSessionController>(
      CONTROLLERS.SET_X509_LOGIN_SESSION
    );

    const mockSession = {} as any;

    controller.handle(
      mockSession,
      responseHandler,
      rucioAuthToken,
      rucioAccount,
      shortVOName,
      rucioTokenExpiry
    );
  });
}
```

2. **Add to auth.config.ts:**

```typescript
CredentialsProvider({
  id: 'x509',
  name: 'Rucio x509',
  credentials: {
    rucioAuthToken: { type: 'text' },
    rucioAccount: { type: 'text' },
    shortVOName: { type: 'text' },
    rucioTokenExpiry: { type: 'text' },
  },
  async authorize(credentials) {
    if (!credentials?.rucioAuthToken || !credentials?.rucioAccount) {
      return null;
    }

    return await authorizeX509(
      credentials.rucioAuthToken as string,
      credentials.rucioAccount as string,
      credentials.shortVOName as string,
      credentials.rucioTokenExpiry as string
    );
  },
}),
```

3. **Update frontend x509 flow** in `src/app/auth/login/page.tsx`:

```typescript
// OLD: Direct call to /api/auth/x509
const handleX509Session = async (auth: AuthViewModel, rucioAccount: string, shortVOName: string) => {
  if (auth.status !== 'success') {
    setAuthViewModel(auth);
    return;
  }

  const res = await fetch('/api/auth/x509', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rucioAccount: rucioAccount,
      rucioAuthToken: auth.rucioAuthToken,
      rucioTokenExpiry: auth.rucioAuthTokenExpires,
      shortVOName: shortVOName,
    }),
  });
  // ...
};

// NEW: Use NextAuth signIn
import { signIn } from 'next-auth/react';

const handleX509Session = async (auth: AuthViewModel, rucioAccount: string, shortVOName: string) => {
  if (auth.status !== 'success') {
    setAuthViewModel(auth);
    return;
  }

  const result = await signIn('x509', {
    rucioAuthToken: auth.rucioAuthToken,
    rucioAccount: rucioAccount,
    shortVOName: shortVOName,
    rucioTokenExpiry: auth.rucioAuthTokenExpires,
    redirect: false,
  });

  if (result?.ok) {
    router.push(redirectURL);
  } else {
    setAuthViewModel({
      status: 'error',
      message: result?.error || 'Failed to set x509 session',
      rucioAccount: '',
      rucioAuthType: '',
      rucioIdentity: '',
      rucioAuthToken: '',
      rucioAuthTokenExpires: '',
      role: Role.USER,
    });
  }
};
```

### Phase 3: Update Session Management

#### 3.1 Create NextAuth Session Utilities

Create new utilities that mirror your existing session-utils but work with NextAuth:

```typescript
// src/lib/infrastructure/auth/nextauth-session-utils.ts
import { getServerSession } from 'next-auth';
import { authConfig } from './auth.config';
import { SessionUser } from '@/lib/core/entity/auth-models';
import { RucioTokenExpiredError } from '@/lib/core/exceptions/auth-exceptions';

export async function getSession() {
  return await getServerSession(authConfig);
}

export async function getSessionUser(): Promise<SessionUser | undefined> {
  const session = await getSession();
  return session?.user;
}

export async function getRucioAuthToken(): Promise<string> {
  const user = await getSessionUser();
  return user?.rucioAuthToken || '';
}

export function validateRucioToken(user: SessionUser): string {
  const rucioAuthToken = user.rucioAuthToken;
  const rucioAuthTokenExpiresAt = user.rucioAuthTokenExpires;
  const expirationTime = new Date(rucioAuthTokenExpiresAt).getTime();
  const currentTime = new Date().getTime();
  const timeLeft = expirationTime - currentTime;

  if (timeLeft < 0) {
    throw new RucioTokenExpiredError('Rucio Auth Token expired');
  }

  return rucioAuthToken;
}

// For API routes that need authenticated session
export async function withAuthenticatedSession<T>(
  handler: (user: SessionUser, token: string) => Promise<T>
): Promise<T | Response> {
  const user = await getSessionUser();

  if (!user || !user.isLoggedIn) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const token = validateRucioToken(user);
    return await handler(user, token);
  } catch (error) {
    if (error instanceof RucioTokenExpiredError) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Rucio Token has expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Rucio Token is invalid' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

#### 3.2 Account Switching Implementation

Create a new API route for account switching using NextAuth's session update:

```typescript
// src/app/api/auth/switch-account/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/infrastructure/auth/auth.config';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authConfig);

  if (!session?.allUsers) {
    return NextResponse.json(
      { error: 'No authentications found' },
      { status: 400 }
    );
  }

  const { account } = await req.json();

  if (!account) {
    return NextResponse.json(
      { error: 'Account is not specified' },
      { status: 400 }
    );
  }

  const userIdx = session.allUsers.findIndex(
    user => user.rucioAccount === account
  );

  if (userIdx === -1) {
    return NextResponse.json(
      { error: 'No authentication found for the specified account' },
      { status: 400 }
    );
  }

  // NextAuth v5 session update
  // This will trigger the jwt callback with trigger: 'update'
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account }),
  });

  return NextResponse.json({ success: true });
}
```

**Frontend usage:**

```typescript
// Old way:
await fetch('/api/auth/switch?account=myaccount&callbackUrl=/dashboard');

// New way:
import { useSession, update } from 'next-auth/react';

// In component:
const { data: session, update } = useSession();

const switchAccount = async (account: string) => {
  await update({ account });
  router.push('/dashboard');
};
```

### Phase 4: Update Middleware

#### 4.1 Replace IronSession Middleware with NextAuth

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { validateRucioToken } from './lib/infrastructure/auth/nextauth-session-utils';

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|.*\\.png$|.*\\.jpg$|favicon.ico|auth/.*).*)',
  ],
};

async function reLogin(request: NextRequest, publicHost: string) {
  const logoutPage = new URL(
    `/api/auth/signout?callbackUrl=${request.nextUrl.pathname}`,
    publicHost
  );
  return NextResponse.redirect(logoutPage);
}

async function initiateLogin(request: NextRequest, publicHost: string) {
  const loginPage = new URL(
    `/auth/login?callbackUrl=${request.nextUrl.pathname}`,
    publicHost
  );
  return NextResponse.redirect(loginPage);
}

export async function middleware(request: NextRequest) {
  const publicHost =
    process.env.NEXT_PUBLIC_WEBUI_HOST ||
    `${request.nextUrl.protocol}//${request.nextUrl.host}`;

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if user is authenticated
    if (!token || !token.user) {
      return await initiateLogin(request, publicHost);
    }

    // Check if user is logged in and token exists
    if (!token.user.isLoggedIn || !token.user.rucioAuthToken) {
      return await reLogin(request, publicHost);
    }

    // Check if rucio token is valid
    try {
      validateRucioToken(token.user);
    } catch (error) {
      return await reLogin(request, publicHost);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return new Response(
      'Internal Server Error. Could not authenticate or redirect to login page',
      { status: 500 }
    );
  }
}
```

### Phase 5: Update API Routes

#### 5.1 Convert Pages Router API Routes to App Router

**Old Pages Router Route:** `src/pages/api/auth/userpass.ts`

```typescript
// OLD
import { withSessionRoute } from '@/lib/infrastructure/auth/session-utils';

async function userpassAuthRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password, account, vo } = req.body;
  const redirectTo = '/dashboard';
  const userpassLoginController = appContainer.get<IUserPassLoginController>(
    CONTROLLERS.USERPASS_LOGIN
  );
  userpassLoginController.handle(username, password, account, vo, req.session, res, redirectTo);
}

export default withSessionRoute(userpassAuthRoute);
```

**NEW:** This route is no longer needed! NextAuth handles it via `/api/auth/[...nextauth]`

#### 5.2 Update Other Protected API Routes

For routes that need authentication (like data fetching), use the new session utilities:

```typescript
// Example: src/app/api/account/list/route.ts
import { withAuthenticatedSession } from '@/lib/infrastructure/auth/nextauth-session-utils';

export async function GET(request: Request) {
  return withAuthenticatedSession(async (user, token) => {
    // Your logic here with authenticated user and token
    const accounts = await fetchAccounts(token);
    return Response.json(accounts);
  });
}
```

### Phase 6: Update Frontend Components

#### 6.1 Wrap App with SessionProvider

```typescript
// src/app/layout.tsx or providers.tsx
'use client';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

#### 6.2 Update Login Page to Use NextAuth

```typescript
// src/app/auth/login/page.tsx
'use client';
import { signIn } from 'next-auth/react';

// For UserPass:
const handleUserpassSubmit = async (
  username: string,
  password: string,
  vo: VO,
  account?: string
) => {
  const result = await signIn('userpass', {
    username,
    password,
    account: account || '',
    vo: vo.shortName,
    redirect: false,
  });

  if (result?.ok) {
    router.push(redirectURL);
  } else if (result?.error) {
    setAuthViewModel({
      status: 'error',
      message: result.error,
      // ... other fields
    });
  }
};
```

#### 6.3 Access Session in Components

```typescript
'use client';
import { useSession } from 'next-auth/react';

export function MyComponent() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Not logged in</div>;

  return (
    <div>
      <p>Account: {session?.user?.rucioAccount}</p>
      <p>Identity: {session?.user?.rucioIdentity}</p>

      {/* Show all logged-in accounts */}
      {session?.allUsers?.map(user => (
        <div key={user.rucioAccount}>
          {user.rucioAccount} ({user.rucioAuthType})
        </div>
      ))}
    </div>
  );
}
```

### Phase 7: Environment Configuration

#### 7.1 Update Environment Variables

Add to `.env.development.local` and `.env.production`:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=<generate-random-secret>
NEXTAUTH_URL=http://localhost:3000

# Keep existing Rucio configs
SESSION_PASSWORD=<keep-existing-or-deprecate>
NEXT_SESSION_COOKIE_NAME=rucio_webui_session
```

Generate secret:
```bash
openssl rand -base64 32
```

### Phase 8: Testing Strategy

#### 8.1 Create Test Utilities for NextAuth

```typescript
// test/fixtures/nextauth-fixtures.ts
import { Session } from 'next-auth';
import { SessionUser, AuthType, Role } from '@/lib/core/entity/auth-models';

export const mockSessionUser: SessionUser = {
  rucioIdentity: 'test-identity',
  rucioAccount: 'test-account',
  rucioAuthType: AuthType.USERPASS,
  rucioAuthToken: 'test-token',
  rucioAuthTokenExpires: new Date(Date.now() + 3600000).toISOString(),
  rucioOIDCProvider: null,
  rucioVO: 'test-vo',
  role: Role.USER,
  isLoggedIn: true,
};

export const mockSession: Session = {
  user: mockSessionUser,
  allUsers: [mockSessionUser],
  expires: new Date(Date.now() + 3600000).toISOString(),
};
```

#### 8.2 Update Existing Tests

```typescript
// Example: test/api/auth/userpass.test.ts
import { signIn } from 'next-auth/react';

jest.mock('next-auth/react');

describe('UserPass Authentication', () => {
  it('should authenticate with valid credentials', async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: true });

    const result = await signIn('userpass', {
      username: 'testuser',
      password: 'testpass',
      account: 'testaccount',
      vo: 'def',
      redirect: false,
    });

    expect(result?.ok).toBe(true);
  });
});
```

### Phase 9: Backward Compatibility (Optional Transition Period)

If you want to support both IronSession and NextAuth during migration:

1. **Dual session reading:**

```typescript
// src/lib/infrastructure/auth/hybrid-session-utils.ts
import { getSessionUser as getIronSessionUser } from './session-utils';
import { getSessionUser as getNextAuthSessionUser } from './nextauth-session-utils';

export async function getSessionUser() {
  // Try NextAuth first
  const nextAuthUser = await getNextAuthSessionUser();
  if (nextAuthUser) return nextAuthUser;

  // Fall back to IronSession
  return await getIronSessionUser();
}
```

2. **Gradual route migration:** Migrate routes one by one, starting with non-critical ones.

### Phase 10: Deployment Checklist

#### 10.1 Pre-Deployment
- [ ] All tests pass
- [ ] Environment variables configured
- [ ] NextAuth secret generated
- [ ] Session cookie name updated (or kept same)
- [ ] Middleware tested in staging
- [ ] Multi-account switching tested
- [ ] Token expiration handling tested

#### 10.2 Deployment Strategy

**Option A: Big Bang (Recommended for small user base)**
- Deploy all changes at once
- All users will need to re-login
- Clear all existing sessions

**Option B: Gradual Migration (Recommended for large user base)**
1. Deploy with backward compatibility
2. New logins use NextAuth
3. Existing sessions continue with IronSession
4. After N days, force re-login for remaining IronSession users
5. Remove IronSession code

#### 10.3 Rollback Plan
- Keep IronSession code in a branch
- Have a feature flag to switch between implementations
- Monitor error rates and user complaints

## Key Differences & Considerations

### Advantages of NextAuth
✅ Industry-standard authentication library
✅ Better TypeScript support
✅ Built-in CSRF protection
✅ Better App Router integration
✅ Active community and documentation
✅ Built-in OAuth providers (if you want OIDC later)
✅ Automatic token refresh patterns

### Challenges
❌ x509 flow requires custom implementation (documented above)
❌ Multi-account support requires custom JWT callback logic
❌ Session structure must be carefully mapped
❌ All users must re-authenticate after migration
❌ Middleware needs updating

### Session Storage Strategy
- **IronSession:** Cookie-based encrypted session
- **NextAuth:** JWT-based session (stored in cookie)

Both are secure, but NextAuth JWTs:
- Are stateless (no server-side storage needed)
- Can be larger (JWT size)
- Are easier to scale

## Timeline Estimate

| Phase | Estimated Time | Priority |
|-------|---------------|----------|
| Phase 1: Setup | 2-4 hours | High |
| Phase 2: Auth Providers | 8-12 hours | High |
| Phase 3: Session Management | 4-6 hours | High |
| Phase 4: Middleware | 2-3 hours | High |
| Phase 5: API Routes | 4-6 hours | Medium |
| Phase 6: Frontend | 4-6 hours | High |
| Phase 7: Environment | 1 hour | High |
| Phase 8: Testing | 8-12 hours | High |
| Phase 9: Compatibility (optional) | 4-6 hours | Low |
| Phase 10: Deployment | 2-4 hours | High |

**Total:** ~40-60 hours for complete migration

## Next Steps

1. ✅ Review this plan with the team
2. Set up a feature branch: `feature/migrate-to-nextauth`
3. Start with Phase 1: Install and configure NextAuth
4. Implement Phase 2: Authentication providers (start with UserPass, as it's simpler)
5. Test thoroughly with Phase 8
6. Deploy with monitoring

## Questions to Address

1. **Do you want to support both IronSession and NextAuth during migration?**
   - Recommended: No, clean cut with forced re-login

2. **Should we update to NextAuth v5 (Auth.js) or stick with v4?**
   - Recommended: v5 for better App Router support

3. **What's your deployment strategy?**
   - Recommended: Deploy to staging first, test thoroughly, then production with announcement

4. **Do you want to implement OIDC now or later?**
   - Recommended: Later, focus on UserPass and x509 first

## Support & Resources

- [NextAuth.js v5 Documentation](https://authjs.dev/)
- [NextAuth with Next.js App Router](https://next-auth.js.org/configuration/nextjs#in-app-router)
- [Custom Credentials Provider](https://next-auth.js.org/configuration/providers/credentials)
- [JWT Callbacks](https://next-auth.js.org/configuration/callbacks#jwt-callback)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-15
**Author:** Claude Code Migration Assistant
