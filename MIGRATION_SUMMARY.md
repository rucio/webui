# IronSession to NextAuth Migration - Implementation Summary

## Status: Backend Complete ✅ | Frontend Pending ⏳

The backend implementation of NextAuth is complete and the project builds successfully. Frontend integration is required to make it functional.

---

## What's Been Implemented

### 1. NextAuth v5 Installation ✅
- Installed `next-auth@5.0.0-beta.29`
- Compatible with Next.js 15 App Router

### 2. Authentication Adapters ✅

#### UserPass Adapter
**File:** `src/lib/infrastructure/auth/nextauth-userpass-adapter.ts`

- Wraps existing `UserPassLoginUseCase` without requiring IronSession
- Custom presenter that works with Promises instead of HTTP responses
- Returns `SessionUser` object on success
- Throws `MultipleAccountsError` when multiple accounts available
- No mock session needed - creates use case directly with required gateways

#### x509 Adapter
**File:** `src/lib/infrastructure/auth/nextauth-x509-adapter.ts`

- Wraps existing `SetX509LoginSessionUseCase`
- Custom presenter for promise-based flow
- Supports the two-step x509 authentication:
  1. Frontend calls Rucio with client cert
  2. Frontend calls `signIn('x509', {...})` with token

### 3. NextAuth Configuration ✅
**File:** `src/lib/infrastructure/auth/auth.config.ts`

**Features:**
- Two Credentials providers (userpass and x509)
- Multi-account session management via JWT callbacks
- Custom session structure preserving `user` and `allUsers`
- Account switching logic in JWT callback
- Token expiration validation
- TypeScript declarations extending NextAuth types

**Key Callbacks:**
```typescript
jwt({ token, user, trigger, session }) {
  // Handles new logins, account switching, user removal
}

session({ session, token }) {
  // Populates session from JWT
}

authorized({ auth, request }) {
  // Route protection (not used due to Edge Runtime limitations)
}
```

### 4. NextAuth Instance ✅
**File:** `src/lib/infrastructure/auth/auth.ts`

Exports:
- `handlers` - For API routes
- `auth` - For server components
- `signIn` - For authentication
- `signOut` - For logout

### 5. API Routes ✅

#### NextAuth Handler
**File:** `src/app/api/auth/[...nextauth]/route.ts`

Handles all NextAuth routes:
- `/api/auth/signin`
- `/api/auth/signout`
- `/api/auth/session`
- `/api/auth/csrf`
- `/api/auth/providers`

#### Account Switching
**File:** `src/app/api/auth/switch-account/route.ts`

POST endpoint for switching between authenticated accounts.

### 6. Session Utilities ✅
**File:** `src/lib/infrastructure/auth/nextauth-session-utils.ts`

**Functions:**
- `getSession()` - Get current session
- `getSessionUser()` - Get active user
- `getRucioAuthToken()` - Get token for current user
- `validateRucioToken()` - Check token expiration
- `withAuthenticatedSession()` - Wrapper for protected API routes

**Usage Example:**
```typescript
export async function GET(request: Request) {
  return withAuthenticatedSession(async (user, token) => {
    const data = await fetchData(token);
    return Response.json(data);
  });
}
```

### 7. Middleware ✅
**File:** `src/middleware.ts`

- Uses `getToken()` from `next-auth/jwt` (Edge Runtime compatible)
- No heavy dependencies (no IoC, no reflect-metadata)
- Validates user authentication and token expiration
- Redirects to login or signout as needed

**Key Fix:** Originally tried to use `auth()` function which imported adapters with heavy dependencies. Switched to `getToken()` which works in Edge Runtime.

### 8. Documentation ✅

- `IRONSESSION_TO_NEXTAUTH_MIGRATION_PLAN.md` - Comprehensive migration plan
- `NEXTAUTH_SETUP.md` - Setup instructions and frontend integration guide
- `MIGRATION_SUMMARY.md` - This file

---

## Environment Configuration Required

Add to `.env.development.local`:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET="y+/W7MyMEu32SFTaTgSnxinAc3tGYfzKlk1OwsmPOfw="
NEXTAUTH_URL="http://localhost:3000"
```

For production, generate a new secret:
```bash
openssl rand -base64 32
```

---

## What Still Needs to be Done

### Frontend Integration (Required)

#### 1. Add SessionProvider
Update `src/app/layout.tsx` to wrap the app:

```typescript
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

#### 2. Update Login Page
File: `src/app/auth/login/page.tsx`

Replace fetch calls to `/api/auth/userpass` and `/api/auth/x509` with NextAuth's `signIn()`:

```typescript
import { signIn } from 'next-auth/react';

// UserPass login
const handleUserpassSubmit = async (username, password, vo, account?) => {
  const result = await signIn('userpass', {
    username,
    password,
    account: account || '',
    vo: vo.shortName,
    redirect: false,
  });

  if (result?.ok) {
    router.push(redirectURL);
  } else {
    // Handle error
  }
};

// x509 session setting
const handleX509Session = async (auth, rucioAccount, shortVOName) => {
  const result = await signIn('x509', {
    rucioAuthToken: auth.rucioAuthToken,
    rucioAccount: rucioAccount,
    shortVOName: shortVOName,
    rucioTokenExpiry: auth.rucioAuthTokenExpires,
    redirect: false,
  });

  if (result?.ok) {
    router.push(redirectURL);
  }
};
```

#### 3. Update Components Using Session
Replace IronSession hooks with NextAuth:

```typescript
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session, status, update } = useSession();

  // Access user
  const user = session?.user;
  const allUsers = session?.allUsers;

  // Switch account
  const switchAccount = async (account: string) => {
    await update({ account });
  };
}
```

#### 4. Migrate API Routes
Convert Pages Router API routes to App Router:

**OLD (Pages Router + IronSession):**
```typescript
// pages/api/some-route.ts
import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';

export default withAuthenticatedSessionRoute(async (req, res, token, user) => {
  const data = await fetchData(token);
  res.json(data);
});
```

**NEW (App Router + NextAuth):**
```typescript
// app/api/some-route/route.ts
import { withAuthenticatedSession } from '@/lib/infrastructure/auth/nextauth-session-utils';

export async function GET(request: Request) {
  return withAuthenticatedSession(async (user, token) => {
    const data = await fetchData(token);
    return Response.json(data);
  });
}
```

### 5. Handle MultipleAccountsError
In the login page, catch the error and show the account selection modal:

```typescript
try {
  await signIn('userpass', { ... });
} catch (error) {
  if (error?.type === 'CredentialsSignin') {
    // Could be MultipleAccountsError
    // Show account selection modal
  }
}
```

**Note:** NextAuth doesn't propagate custom errors well. You may need to handle this by:
1. Returning a special status code from the authorize function
2. Or, calling the userpass endpoint directly first to check for multiple accounts, then calling signIn with the selected account

### Testing Required

1. **UserPass Login**
   - Single account login
   - Multiple account selection
   - Invalid credentials
   - Token expiration

2. **x509 Login**
   - Certificate-based authentication
   - Token extraction from headers
   - Session creation

3. **Multi-Account Support**
   - Login with multiple accounts
   - Switch between accounts
   - Remove account from session

4. **Middleware**
   - Redirect to login when unauthenticated
   - Allow authenticated requests
   - Handle expired tokens

### Cleanup (Optional but Recommended)

Once everything is working:

1. Remove IronSession dependencies:
   ```bash
   npm uninstall iron-session
   ```

2. Delete old files:
   - `src/lib/infrastructure/auth/session.ts`
   - `src/lib/infrastructure/auth/session-utils.ts` (keep temporarily for reference)
   - `src/pages/api/auth/userpass.ts` (Pages Router routes)
   - `src/pages/api/auth/x509.ts`
   - `src/pages/api/auth/logout.ts`
   - `src/pages/api/auth/switch.ts`

3. Update tests to use NextAuth mocks

---

## Architecture Decisions

### Why No Mock Session?
The adapters bypass the IoC factory to avoid IronSession dependency. They:
1. Get gateways directly from the container
2. Create custom presenters that work with Promises
3. Instantiate use cases directly
4. Execute the use case and resolve/reject based on the presenter callbacks

This approach:
- ✅ Reuses existing use case logic
- ✅ Maintains clean architecture
- ✅ Avoids coupling to IronSession
- ✅ Works with NextAuth's synchronous authorize function

### Why getToken() in Middleware?
The middleware runs in Edge Runtime, which has limitations:
- ❌ Can't use `reflect-metadata`
- ❌ Can't import heavy IoC containers
- ❌ Can't use Node.js-only APIs

Using `getToken()`:
- ✅ Works in Edge Runtime
- ✅ Directly reads JWT from cookies
- ✅ No heavy dependencies
- ✅ Fast and efficient

### Session Strategy: JWT vs Database
We chose JWT strategy because:
- ✅ Stateless (no server-side storage)
- ✅ Scales horizontally
- ✅ Fast (no database lookups)
- ✅ Similar to IronSession (cookie-based)
- ⚠️ Slightly larger cookies (JWT contains all data)
- ⚠️ Can't revoke sessions server-side (must wait for expiry)

---

## Known Limitations

1. **MultipleAccountsError Handling**
   - NextAuth doesn't have built-in support for custom errors in authorize
   - May need workaround for account selection modal

2. **Session Revocation**
   - JWT sessions can't be revoked server-side
   - Must wait for token expiration
   - Could implement a blacklist if needed

3. **Cookie Size**
   - JWT cookies are larger than IronSession
   - Contains full SessionUser + all users array
   - Monitor cookie size with many accounts

4. **OIDC Not Implemented**
   - Plan includes OIDC but not yet implemented
   - NextAuth has built-in OIDC providers
   - Can be added later without major changes

---

## Build Status

✅ **Build successful** with warnings only (no errors)

Warnings are pre-existing ESLint/TypeScript issues not related to the migration.

---

## Testing the Migration

### Prerequisites
1. Add `NEXTAUTH_SECRET` to `.env.development.local`
2. Implement frontend changes listed above

### Manual Testing Steps

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test UserPass login:**
   - Navigate to http://localhost:3000
   - Should redirect to `/auth/login`
   - Enter credentials and submit
   - Should redirect to dashboard on success

3. **Test x509 login:**
   - Requires client certificate configured in browser
   - Frontend makes direct call to Rucio
   - Then calls `signIn('x509', {...})`
   - Verify session is created

4. **Test multi-account:**
   - Log in with first account
   - Log in with second account
   - Both should appear in `session.allUsers`
   - Switch between accounts

5. **Test middleware:**
   - Access protected route without auth -> redirect to login
   - Access with valid auth -> allow
   - Access with expired token -> redirect to signout

---

## Performance Considerations

### Bundle Size
- NextAuth v5: ~50KB gzipped
- IronSession: ~10KB gzipped
- Net increase: ~40KB

### Runtime Performance
- JWT decoding: < 1ms
- No database lookups
- Middleware runs on Edge Runtime (faster)

### Cookie Size
- IronSession: ~1-2KB per session
- NextAuth JWT: ~2-4KB per session (with multi-account)
- Monitor if approaching browser limits (4KB per cookie)

---

## Rollback Plan

If issues arise:

1. **Revert middleware:** Restore `src/middleware.ts` from git history
2. **Keep old routes:** IronSession routes still exist, just not being used
3. **Switch frontend:** Change `signIn()` calls back to fetch() calls
4. **Environment:** Remove NEXTAUTH_SECRET, keep SESSION_PASSWORD

The old system is not deleted, just bypassed. Easy to roll back if needed.

---

## Support & Resources

### Documentation
- [NextAuth.js v5 Docs](https://authjs.dev/)
- [NextAuth with App Router](https://next-auth.js.org/configuration/nextjs#in-app-router)
- [JWT Strategy](https://next-auth.js.org/configuration/options#jwt)
- [Credentials Provider](https://next-auth.js.org/providers/credentials)

### Files to Reference
- `IRONSESSION_TO_NEXTAUTH_MIGRATION_PLAN.md` - Detailed migration plan
- `NEXTAUTH_SETUP.md` - Setup and frontend integration
- `src/lib/infrastructure/auth/nextauth-userpass-adapter.ts` - UserPass adapter
- `src/lib/infrastructure/auth/nextauth-x509-adapter.ts` - x509 adapter
- `src/lib/infrastructure/auth/auth.config.ts` - NextAuth configuration

### Key Insights
1. The adapters DON'T use mock sessions - they instantiate use cases directly
2. The middleware uses `getToken()` not `auth()` due to Edge Runtime
3. Multi-account support is via JWT callbacks, not multiple sessions
4. Session structure matches IronSession for easier migration

---

## Next Steps

**Immediate (Required for functionality):**
1. Add `NEXTAUTH_SECRET` to environment
2. Wrap app with `SessionProvider`
3. Update login page to use `signIn()`
4. Test authentication flows

**Short-term:**
5. Migrate remaining API routes to App Router
6. Update tests
7. Handle MultipleAccountsError properly

**Long-term:**
8. Remove IronSession dependencies
9. Implement OIDC if needed
10. Add session analytics/monitoring

---

## Questions?

If you have questions about:
- **Architecture decisions:** Review the "Architecture Decisions" section
- **Implementation details:** Check the source files with inline comments
- **Frontend integration:** See `NEXTAUTH_SETUP.md`
- **Migration strategy:** Review `IRONSESSION_TO_NEXTAUTH_MIGRATION_PLAN.md`

---

**Migration completed by:** Claude Code
**Date:** October 15, 2025
**Status:** Backend Complete ✅ | Frontend Pending ⏳
