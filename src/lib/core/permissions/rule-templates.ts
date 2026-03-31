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
        // Admin-only: only global admins can view and act on the approval queue page.
        viewApprovalQueue: true,
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
        // TODO: enforce ownership — should be `rule => rule.account === user.rucioAccount`.
        // Blocked on PermissionGateway integration that supplies the rule object at call-site.
        // Tracked in the follow-up for PermissionGateway integration.
        update: rule => true,
        comment: rule => true,
        set_infinite_lifetime: false,
        // Non-admins cannot access the approval queue page; it is a global-admin-only surface.
        viewApprovalQueue: false,
    },
}));
