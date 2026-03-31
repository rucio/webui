import { permissionSchema } from './permission-schema';
import type { SessionUser } from '@/lib/core/entity/auth-models';

/**
 * Admin template: full access to all rule actions.
 */
export const adminRuleTemplate = permissionSchema.template({
    rule: {
        approve: true,
        update: true,
        comment: true,
        set_infinite_lifetime: true,
    },
});

/**
 * User template: access gated on rule ownership.
 *
 * - approve: always false (only global admins can approve)
 * - update: true only if the rule's account matches the session user
 * - comment: true only if the rule's account matches the session user
 *
 */
export const userRuleTemplate = permissionSchema.template((user: SessionUser) => ({
    rule: {
        approve: false,
        /* TODO: we need a proper PermissionGateway, usecase and endpoint that connects with the Rucio Policy Package via the Rucio Server */
        update: rule => true, //rule?.account === user.rucioAccount,
        comment: rule => true, // rule?.account === user.rucioAccount,
        set_infinite_lifetime: false,
    },
}));
