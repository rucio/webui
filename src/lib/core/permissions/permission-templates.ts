import type { SessionUser } from '@/lib/core/entity/auth-models';
import { permissionSchema } from './permission-schema';
import { adminRuleTemplate, userRuleTemplate } from './rule-templates';
import { adminAccountTemplate, userAccountTemplate } from './account-templates';

/** Complete admin rule set: every entity's admin template merged. */
export const adminTemplate = permissionSchema.template(() => ({
    ...adminRuleTemplate(),
    ...adminAccountTemplate(),
}));

/** Complete rule set for a non-admin session user: every entity's user template merged. */
export const userTemplate = permissionSchema.template((user: SessionUser) => ({
    ...userRuleTemplate(user),
    ...userAccountTemplate(user),
}));
