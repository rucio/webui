import {
    FEATURE_REGISTRY,
    FeatureKey,
    resolveFeatureEnabled,
    resolveEnabledSet,
    envKeyForFeature,
    isFeatureEnabledInEnv,
} from '@/lib/core/entity/feature-config';

describe('feature-config registry + resolution', () => {
    it('maps a dotted key to its FEATURE_ env var name', () => {
        expect(envKeyForFeature('rules.create')).toBe('FEATURE_RULES_CREATE');
        expect(envKeyForFeature('rules')).toBe('FEATURE_RULES');
    });

    it('uses the registry default when the env value is unset', () => {
        expect(resolveFeatureEnabled('rules', {})).toBe(true);
    });

    it('honours an explicit false env value', () => {
        expect(resolveFeatureEnabled('rules', { rules: 'false' })).toBe(false);
    });

    it('cascades a disabled parent to its child', () => {
        expect(resolveFeatureEnabled('rules.create', { rules: 'false' })).toBe(false);
    });

    it('keeps a child enabled when parent and child are both on', () => {
        expect(resolveFeatureEnabled('rules.create', { rules: 'true', 'rules.create': 'true' })).toBe(true);
    });

    it('disables a child whose own value is false even if parent is on', () => {
        expect(resolveFeatureEnabled('rules.create', { 'rules.create': 'false' })).toBe(false);
    });

    it('enables accounts by default and maps it to FEATURE_ACCOUNTS', () => {
        expect(resolveFeatureEnabled('accounts', {})).toBe(true);
        expect(envKeyForFeature('accounts')).toBe('FEATURE_ACCOUNTS');
        expect(isFeatureEnabledInEnv('accounts', { FEATURE_ACCOUNTS: 'false' })).toBe(false);
    });

    it('enables accounts.manage by default, maps it to FEATURE_ACCOUNTS_MANAGE and disables it with accounts', () => {
        expect(resolveFeatureEnabled('accounts.manage', {})).toBe(true);
        expect(envKeyForFeature('accounts.manage')).toBe('FEATURE_ACCOUNTS_MANAGE');
        expect(isFeatureEnabledInEnv('accounts.manage', { FEATURE_ACCOUNTS_MANAGE: 'false' })).toBe(false);
        expect(isFeatureEnabledInEnv('accounts.manage', { FEATURE_ACCOUNTS: 'false' })).toBe(false);
    });

    it('resolveEnabledSet returns a boolean for every registry key', () => {
        const set = resolveEnabledSet({});
        const keys = Object.keys(FEATURE_REGISTRY) as FeatureKey[];
        keys.forEach(k => expect(typeof set[k]).toBe('boolean'));
        expect(Object.keys(set).sort()).toEqual(keys.sort());
    });

    it('isFeatureEnabledInEnv reads FEATURE_* env names and cascades a disabled parent', () => {
        expect(isFeatureEnabledInEnv('rules.create', { FEATURE_RULES: 'false' })).toBe(false);
        expect(isFeatureEnabledInEnv('rules.create', {})).toBe(true);
    });
});
