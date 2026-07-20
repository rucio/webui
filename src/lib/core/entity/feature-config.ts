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
    'dids.metadata': { default: true, pages: [] },
    'dids.mutate': { default: true, pages: [] },
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

/** Resolve every registry key into a flat map. */
export function resolveEnabledSet(rawEnv: Partial<Record<FeatureKey, string | undefined>>): FeatureFlagMap {
    const result = {} as FeatureFlagMap;
    (Object.keys(FEATURE_REGISTRY) as FeatureKey[]).forEach(key => {
        result[key] = resolveFeatureEnabled(key, rawEnv);
    });
    return result;
}
