import { AuthType, Role, SessionUser } from '@/lib/core/entity/auth-models';
import { permix as permissionSchema, adminRuleTemplate, userRuleTemplate } from '@/lib/core/permissions';

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
            permissionSchema.setup(adminRuleTemplate());
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
    });

    describe('user role', () => {
        const user = makeSessionUser(Role.USER, 'alice');

        beforeEach(() => {
            permissionSchema.setup(userRuleTemplate(user));
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
    });

    describe('countryRole does not grant admin privileges', () => {
        it('user with countryRole ADMIN cannot approve rules', () => {
            const user = makeSessionUser(Role.USER, 'testuser', Role.ADMIN);
            permissionSchema.setup(userRuleTemplate(user));
            expect(permissionSchema.check('rule', 'approve')).toBe(false);
        });
    });
});
