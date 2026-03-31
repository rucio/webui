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
        action: 'approve' | 'update' | 'comment' | 'set_infinite_lifetime';
    };
};

/**
 * Singleton Permix instance used throughout the application.
 * Created once at module level; configured at runtime via permix.setup().
 */
export const permissionSchema = createPermix<RucioPermissions>();
