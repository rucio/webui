import { createPermix } from 'permix';
import type { RuleMeta } from '@/lib/core/entity/rucio';

/**
 * Central Permix permission definition for the Rucio WebUI.
 *
 * Each key is an entity name; each value declares the allowed actions
 * and an optional `dataType` for data-dependent checks.
 *
 * To add a new entity (e.g. DID, RSE), add a new key here.
 */
export type RucioPermissions = {
    rule: {
        dataType: Pick<RuleMeta, 'account'>;
        /**
         * Actions on the rule resource:
         * - approve: approve/deny a specific rule (used on rule detail page)
         * - update: modify rule attributes
         * - comment: add a comment to a rule
         * - set_infinite_lifetime: remove the rule's expiry
         * - viewApprovalQueue: access the admin-only approve rules page that lists
         *   all rules in WAITING_APPROVAL state. Kept separate from `approve` so the
         *   page guard has an explicit, descriptive symbol rather than re-using the
         *   per-rule action.
         */
        action: 'approve' | 'update' | 'comment' | 'set_infinite_lifetime' | 'viewApprovalQueue';
    };
};

/**
 * Singleton Permix instance used throughout the application.
 * Created once at module level; configured at runtime via permix.setup().
 */
export const permissionSchema = createPermix<RucioPermissions>();
