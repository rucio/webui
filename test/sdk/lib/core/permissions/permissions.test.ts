import { AuthType, Role, SessionUser } from '@/lib/core/entity/auth-models';
import { permix as permissionSchema, adminTemplate, userTemplate } from '@/lib/core/permissions';

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

describe('Rule permissions via Permix', () => {
    describe('admin role', () => {
        beforeEach(() => {
            permissionSchema.setup(adminTemplate());
        });

        it('can approve any rule', () => {
            expect(permissionSchema.check('rule', 'approve')).toBe(true);
        });

        it('can update any rule regardless of ownership', () => {
            expect(permissionSchema.check('rule', 'update', { account: 'someotheruser' })).toBe(true);
        });

        it('can comment on any rule', () => {
            expect(permissionSchema.check('rule', 'comment', { account: 'someotheruser' })).toBe(true);
        });

        it('can set infinite lifetime', () => {
            expect(permissionSchema.check('rule', 'set_infinite_lifetime')).toBe(true);
        });

        it('can view the approve rules page', () => {
            expect(permissionSchema.check('rule', 'viewApprovalQueue')).toBe(true);
        });
    });

    describe('user role', () => {
        const user = makeSessionUser(Role.USER, 'alice');

        beforeEach(() => {
            permissionSchema.setup(userTemplate(user));
        });

        it('cannot approve rules', () => {
            expect(permissionSchema.check('rule', 'approve')).toBe(false);
        });

        it('can update any rule (pending PermissionGateway integration)', () => {
            expect(permissionSchema.check('rule', 'update', { account: 'alice' })).toBe(true);
            expect(permissionSchema.check('rule', 'update', { account: 'bob' })).toBe(true);
        });

        it('can comment on any rule (pending PermissionGateway integration)', () => {
            expect(permissionSchema.check('rule', 'comment', { account: 'alice' })).toBe(true);
            expect(permissionSchema.check('rule', 'comment', { account: 'bob' })).toBe(true);
        });

        it('cannot set infinite lifetime', () => {
            expect(permissionSchema.check('rule', 'set_infinite_lifetime')).toBe(false);
        });

        it('cannot view the approve rules page', () => {
            expect(permissionSchema.check('rule', 'viewApprovalQueue')).toBe(false);
        });
    });

    describe('countryRole does not grant admin privileges', () => {
        it('user with countryRole ADMIN cannot approve rules', () => {
            const user = makeSessionUser(Role.USER, 'testuser', Role.ADMIN);
            permissionSchema.setup(userTemplate(user));
            expect(permissionSchema.check('rule', 'approve')).toBe(false);
        });

        it('user with countryRole ADMIN cannot view the approve rules page', () => {
            const user = makeSessionUser(Role.USER, 'testuser', Role.ADMIN);
            permissionSchema.setup(userTemplate(user));
            expect(permissionSchema.check('rule', 'viewApprovalQueue')).toBe(false);
        });
    });
});

describe('Account permissions via Permix', () => {
    describe('admin role', () => {
        beforeEach(() => {
            permissionSchema.setup(adminTemplate());
        });

        it.each(['list', 'view', 'manage', 'lifecycle'] as const)('can %s any account', action => {
            expect(permissionSchema.check('account', action, { account: 'someotheruser' })).toBe(true);
        });

        it('keeps the rule permissions configured', () => {
            expect(permissionSchema.check('rule', 'approve')).toBe(true);
        });
    });

    describe('user role', () => {
        const user = makeSessionUser(Role.USER, 'alice');

        beforeEach(() => {
            permissionSchema.setup(userTemplate(user));
        });

        it('can view their own account', () => {
            expect(permissionSchema.check('account', 'view', { account: 'alice' })).toBe(true);
        });

        it('cannot view another account', () => {
            expect(permissionSchema.check('account', 'view', { account: 'other' })).toBe(false);
        });

        it.each(['list', 'manage', 'lifecycle'] as const)('cannot %s accounts', action => {
            expect(permissionSchema.check('account', action, { account: 'alice' })).toBe(false);
        });

        it('keeps the rule permissions configured', () => {
            expect(permissionSchema.check('rule', 'approve')).toBe(false);
        });
    });
});
