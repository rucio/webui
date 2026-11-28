import { parseBoolEnv } from '@/lib/core/utils/env-utils';

/**
 * One feature domain in the registry.
 * - default: value used when the FEATURE_* env var is unset.
 * - parent: key of the parent feature; a child is only enabled if its parent is.
 * - pages: Next.js route patterns this feature gates (used by nav + page guards).
 */
export interface FeatureDefinition {
    default: boolean;
    parent?: string;
    pages: string[];
}

export const FEATURE_REGISTRY = {
    rules: { default: true, pages: ['/rules', '/rule/[id]'] },
    'rules.create': { default: true, parent: 'rules', pages: ['/rule/create'] },
    'rules.approve': { default: true, parent: 'rules', pages: ['/rules/approve'] },
    subscriptions: { default: true, pages: ['/subscriptions', '/subscription/[account]/[name]'] },
    rses: { default: true, pages: ['/rses', '/rse/[name]'] },
    // Admin account list and account detail pages; read endpoints under /api/feature/*account*
    accounts: { default: true, pages: ['/accounts', '/account/[name]'] },
    // Mutations on the account pages; off for deployments that manage accounts elsewhere (e.g. synced from CRIC)
    'accounts.manage': { default: true, parent: 'accounts', pages: [] },
    // Each area of account changes can be turned off on its own; all of them need accounts.manage.
    // Create, edit, suspend/reactivate and delete accounts
    'accounts.manage.core': { default: true, parent: 'accounts.manage', pages: [] },
    // Add and remove identities
    'accounts.manage.identities': { default: true, parent: 'accounts.manage', pages: [] },
    // Add, edit and delete account attributes
    'accounts.manage.attributes': { default: true, parent: 'accounts.manage', pages: [] },
    // Set and remove quotas (account limits)
    'accounts.manage.quotas': { default: true, parent: 'accounts.manage', pages: [] },
    'dids.metadata': { default: true, pages: [] },
    'dids.mutate': { default: true, pages: [] },
    // ATLAS-only: AMI tag chips on DID views + /api/feature/get-ami-tag-info
    'dids.ami_tags': { default: false, pages: [] },
    // ATLAS-only: PanDA task link on DID views + /api/feature/get-panda-task-link
    'dids.panda_task': { default: false, pages: [] },
} as const satisfies Record<string, FeatureDefinition>;

export type FeatureKey = keyof typeof FEATURE_REGISTRY;

export type FeatureFlagMap = Record<FeatureKey, boolean>;

/** FEATURE_ + UPPER_SNAKE of the key (dots become underscores). */
export function envKeyForFeature(key: FeatureKey): string {
    return 'FEATURE_' + key.toUpperCase().replace(/\./g, '_');
}

/**
 * Effective enabled value for a single key: registry default when unset,
 * else parseBoolEnv, then AND-ed with every ancestor's effective value.
 */
export function resolveFeatureEnabled(key: FeatureKey, rawEnv: Partial<Record<FeatureKey, string | undefined>>): boolean {
    const def: FeatureDefinition = FEATURE_REGISTRY[key];
    const raw = rawEnv[key];
    const own = raw === undefined ? def.default : parseBoolEnv(raw);
    if (!own) return false;
    if (def.parent) {
        return resolveFeatureEnabled(def.parent as FeatureKey, rawEnv);
    }
    return true;
}

/** A key's own value, ignoring its ancestors: the registry default when unset. */
function ownFeatureValue(key: FeatureKey, rawEnv: Partial<Record<FeatureKey, string | undefined>>): boolean {
    const raw = rawEnv[key];
    return raw === undefined ? FEATURE_REGISTRY[key].default : parseBoolEnv(raw);
}

/**
 * Flags explicitly set to true that have no effect because an ancestor is turned off,
 * e.g. FEATURE_ACCOUNTS_MANAGE_QUOTAS=true with FEATURE_ACCOUNTS_MANAGE=false.
 * Each is reported with its closest disabled ancestor. Flags left unset are not reported.
 */
export function findShadowedFeatureFlags(
    rawEnv: Partial<Record<FeatureKey, string | undefined>>,
): { key: FeatureKey; disabledAncestor: FeatureKey }[] {
    const shadowed: { key: FeatureKey; disabledAncestor: FeatureKey }[] = [];
    (Object.keys(FEATURE_REGISTRY) as FeatureKey[]).forEach(key => {
        const raw = rawEnv[key];
        if (raw === undefined || !parseBoolEnv(raw)) return;
        let parent = (FEATURE_REGISTRY[key] as FeatureDefinition).parent as FeatureKey | undefined;
        while (parent) {
            if (!ownFeatureValue(parent, rawEnv)) {
                shadowed.push({ key, disabledAncestor: parent });
                return;
            }
            parent = (FEATURE_REGISTRY[parent] as FeatureDefinition).parent as FeatureKey | undefined;
        }
    });
    return shadowed;
}

/** Resolve every registry key into a flat map. */
export function resolveEnabledSet(rawEnv: Partial<Record<FeatureKey, string | undefined>>): FeatureFlagMap {
    const result = {} as FeatureFlagMap;
    (Object.keys(FEATURE_REGISTRY) as FeatureKey[]).forEach(key => {
        result[key] = resolveFeatureEnabled(key, rawEnv);
    });
    return result;
}

/** Picks the FEATURE_* values for every registry key out of an env object. */
export function readFeatureEnv(env: Record<string, string | undefined>): Partial<Record<FeatureKey, string | undefined>> {
    const raw = {} as Partial<Record<FeatureKey, string | undefined>>;
    (Object.keys(FEATURE_REGISTRY) as FeatureKey[]).forEach(key => {
        raw[key] = env[envKeyForFeature(key)];
    });
    return raw;
}

/**
 * Synchronous flag check for module-load-time decisions (e.g. whether to bind
 * an IoC feature). Runtime checks should go through FeatureConfigGateway.
 */
export function isFeatureEnabledInEnv(key: FeatureKey, env: Record<string, string | undefined>): boolean {
    return resolveFeatureEnabled(key, readFeatureEnv(env));
}
