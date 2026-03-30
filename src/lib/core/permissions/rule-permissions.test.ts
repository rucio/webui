import { AuthType, Role, SessionUser } from '@/lib/core/entity/auth-models';
import { PermissionContext } from './permission-types';
import { canApproveRule, canUpdateRule } from './rule-permissions';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSessionUser(role: Role, rucioAccount: string, countryRole?: Role): SessionUser {
    return {
        rucioIdentity: `${rucioAccount}@example.com`,
        rucioAccount,
        rucioVO: 'def',
        role,
        countryRole,
        rucioAuthToken: 'token',
        rucioAuthTokenExpires: '2099-01-01T00:00:00Z',
        rucioAuthType: AuthType.USERPASS,
        rucioOIDCProvider: null,
        isLoggedIn: true,
    };
}

function makeCtx(role: Role, rucioAccount = 'testuser', countryRole?: Role): PermissionContext {
    return { account: makeSessionUser(role, rucioAccount, countryRole) };
}

// ---------------------------------------------------------------------------
// canApproveRule
// ---------------------------------------------------------------------------

describe('canApproveRule', () => {
    it('returns true when the account has role ADMIN', () => {
        expect(canApproveRule(makeCtx(Role.ADMIN))).toBe(true);
    });

    it('returns false when the account has role USER', () => {
        expect(canApproveRule(makeCtx(Role.USER))).toBe(false);
    });

    it('returns false when the account has countryRole ADMIN but role USER (countryRole does not grant approval rights)', () => {
        expect(canApproveRule(makeCtx(Role.USER, 'testuser', Role.ADMIN))).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// canUpdateRule
// ---------------------------------------------------------------------------

describe('canUpdateRule', () => {
    it('returns true when the account has role ADMIN, regardless of rule ownership', () => {
        const ctx = makeCtx(Role.ADMIN, 'adminuser');
        expect(canUpdateRule(ctx, { account: 'someotheruser' })).toBe(true);
    });

    it('returns true when the account has role USER and owns the rule', () => {
        const ctx = makeCtx(Role.USER, 'alice');
        expect(canUpdateRule(ctx, { account: 'alice' })).toBe(true);
    });

    it('returns false when the account has role USER and does not own the rule', () => {
        const ctx = makeCtx(Role.USER, 'alice');
        expect(canUpdateRule(ctx, { account: 'bob' })).toBe(false);
    });
});
