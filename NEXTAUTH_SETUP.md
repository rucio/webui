# NextAuth Setup Instructions

## Environment Variables

Add the following to your `.env.development.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET="y+/W7MyMEu32SFTaTgSnxinAc3tGYfzKlk1OwsmPOfw="
NEXTAUTH_URL="http://localhost:3000"

# For production, generate a new secret with:
# openssl rand -base64 32
```

## What's Been Implemented

### 1. Authentication Adapters
- `src/lib/infrastructure/auth/nextauth-userpass-adapter.ts` - UserPass authentication
- `src/lib/infrastructure/auth/nextauth-x509-adapter.ts` - x509 authentication

### 2. NextAuth Configuration
- `src/lib/infrastructure/auth/auth.config.ts` - Main configuration with multi-account support
- `src/lib/infrastructure/auth/auth.ts` - NextAuth instance export

### 3. API Routes
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- `src/app/api/auth/switch-account/route.ts` - Account switching endpoint

### 4. Session Utilities
- `src/lib/infrastructure/auth/nextauth-session-utils.ts` - Helper functions for session management

### 5. Middleware
- `src/middleware.ts` - Updated to use NextAuth for authentication checks

## Key Features

###  Multi-Account Support
- Users can log in with multiple accounts simultaneously
- Switch between accounts without re-authenticating
- Session structure maintains `user` (active) and `allUsers` (all authenticated accounts)

###  UserPass Authentication
- Works with existing `UserPassLoginUseCase`
- Handles multiple account selection modal
- Returns `MultipleAccountsError` when user needs to select account

###  x509 Authentication
- Two-step process maintained:
  1. Frontend calls Rucio directly with client cert
  2. Frontend calls `signIn('x509', {...})` with the token
- Works with existing `SetX509LoginSessionUseCase`

## Next Steps

### Frontend Updates Required

#### 1. Wrap App with SessionProvider

Update `src/app/layout.tsx`:

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

Update `src/app/auth/login/page.tsx`:

```typescript
import { signIn } from 'next-auth/react';

// For UserPass:
const handleUserpassSubmit = async (
  username: string,
  password: string,
  vo: VO,
  account?: string
) => {
  try {
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
  } catch (error) {
    // Handle MultipleAccountsError
    if (error.message === 'Multiple accounts available') {
      // Show account selection modal
    }
  }
};

// For x509 session:
const handleX509Session = async (
  auth: AuthViewModel,
  rucioAccount: string,
  shortVOName: string
) => {
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
      // ... other fields
    });
  }
};
```

#### 3. Use Session in Components

```typescript
'use client';
import { useSession } from 'next-auth/react';

export function MyComponent() {
  const { data: session, status, update } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Not logged in</div>;

  // Switch account
  const switchAccount = async (account: string) => {
    await update({ account });
    router.push('/dashboard');
  };

  return (
    <div>
      <p>Account: {session?.user?.rucioAccount}</p>
      <p>Identity: {session?.user?.rucioIdentity}</p>

      {/* Show all logged-in accounts */}
      {session?.allUsers?.map(user => (
        <button key={user.rucioAccount} onClick={() => switchAccount(user.rucioAccount)}>
          {user.rucioAccount} ({user.rucioAuthType})
        </button>
      ))}
    </div>
  );
}
```

#### 4. Update API Routes

For App Router routes that need authentication:

```typescript
// OLD (IronSession)
import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';

export default withAuthenticatedSessionRoute(async (req, res, token, user) => {
  // ...
});

// NEW (NextAuth)
import { withAuthenticatedSession } from '@/lib/infrastructure/auth/nextauth-session-utils';

export async function GET(request: Request) {
  return withAuthenticatedSession(async (user, token) => {
    const data = await fetchData(token);
    return Response.json(data);
  });
}
```

## Testing

Run the development server:

```bash
npm run dev
```

Visit http://localhost:3000 and test:
1. UserPass login
2. x509 login (requires client certificate)
3. Multi-account login
4. Account switching
5. Token expiration handling

## Migration Status

- [x] Install NextAuth
- [x] Create authentication adapters
- [x] Configure NextAuth with multi-account support
- [x] Update middleware
- [x] Create session utilities
- [ ] Update frontend login page
- [ ] Update frontend components to use `useSession`
- [ ] Migrate API routes
- [ ] Update tests
- [ ] Remove IronSession dependencies

## Troubleshooting

### Issue: "NEXTAUTH_SECRET is not defined"
**Solution:** Add `NEXTAUTH_SECRET` to your `.env.development.local` file

### Issue: Multiple account modal not showing
**Solution:** Check that the frontend is catching the `MultipleAccountsError` properly

### Issue: Session not persisting
**Solution:** Ensure `SessionProvider` wraps your app in the root layout

### Issue: Middleware redirect loop
**Solution:** Check that `/auth/*` and `/api/auth/*` are excluded in middleware matcher

## Architecture Notes

### Why No Mock Session?
The adapters create use cases directly without the IoC factory to avoid IronSession dependency. They use custom presenters that work with Promises instead of HTTP responses.

### Session Structure
```typescript
{
  user: SessionUser,           // Currently active user
  allUsers: SessionUser[],     // All authenticated users
  expires: string              // Session expiration
}
```

### JWT Strategy
NextAuth uses JWT-based sessions stored in cookies. This is:
- Stateless (no server-side storage needed)
- Secure (encrypted and signed)
- Scalable
- Slightly larger than IronSession cookies

## Support

For questions or issues, refer to:
- [NextAuth.js Documentation](https://authjs.dev/)
- [Migration Plan](./IRONSESSION_TO_NEXTAUTH_MIGRATION_PLAN.md)
