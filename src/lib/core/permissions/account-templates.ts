import type { PermissionRules } from './permission-schema';
import type { SessionUser } from '@/lib/core/entity/auth-models';

/**
 * Admin template: full access to all account actions.
 */
export const adminAccountTemplate = (): Pick<PermissionRules, 'account'> => ({
    account: {
        list: true,
        view: true,
        manage: true,
        lifecycle: true,
    },
});

/**
 * User template: users may only view their own account.
 */
export const userAccountTemplate = (user: SessionUser): Pick<PermissionRules, 'account'> => ({
    account: {
        list: false,
        view: target => target?.account === user.rucioAccount,
        manage: false,
        lifecycle: false,
    },
});
