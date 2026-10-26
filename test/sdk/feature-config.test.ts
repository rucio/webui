import {
    FEATURE_REGISTRY,
    FeatureKey,
    resolveFeatureEnabled,
    resolveEnabledSet,
    envKeyForFeature,
    isFeatureEnabledInEnv,
    findShadowedFeatureFlags,
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

    const MANAGE_AREAS: [FeatureKey, string][] = [
        ['accounts.manage.core', 'FEATURE_ACCOUNTS_MANAGE_CORE'],
        ['accounts.manage.identities', 'FEATURE_ACCOUNTS_MANAGE_IDENTITIES'],
        ['accounts.manage.attributes', 'FEATURE_ACCOUNTS_MANAGE_ATTRIBUTES'],
        ['accounts.manage.quotas', 'FEATURE_ACCOUNTS_MANAGE_QUOTAS'],
    ];

    it.each(MANAGE_AREAS)('enables %s by default and maps it to %s', (key, env) => {
        expect(resolveFeatureEnabled(key, {})).toBe(true);
        expect(envKeyForFeature(key)).toBe(env);
        expect(isFeatureEnabledInEnv(key, { [env]: 'false' })).toBe(false);
    });

    it.each(MANAGE_AREAS)('disables %s with accounts.manage or accounts', key => {
        expect(isFeatureEnabledInEnv(key, { FEATURE_ACCOUNTS_MANAGE: 'false' })).toBe(false);
        expect(isFeatureEnabledInEnv(key, { FEATURE_ACCOUNTS: 'false' })).toBe(false);
    });

    it('turns one manage area off without touching the others', () => {
        const set = resolveEnabledSet({ 'accounts.manage.quotas': 'false' });
        expect(set['accounts.manage.quotas']).toBe(false);
        expect(set['accounts.manage.core']).toBe(true);
        expect(set['accounts.manage.identities']).toBe(true);
        expect(set['accounts.manage.attributes']).toBe(true);
        expect(set['accounts.manage']).toBe(true);
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

describe('findShadowedFeatureFlags', () => {
    it('reports a flag set to true while its parent is false', () => {
        expect(findShadowedFeatureFlags({ 'accounts.manage': 'false', 'accounts.manage.quotas': 'true' })).toEqual([
            { key: 'accounts.manage.quotas', disabledAncestor: 'accounts.manage' },
        ]);
    });

    it('reports the closest disabled ancestor', () => {
        expect(findShadowedFeatureFlags({ accounts: 'false', 'accounts.manage': 'true', 'accounts.manage.core': 'true' })).toEqual([
            { key: 'accounts.manage', disabledAncestor: 'accounts' },
            { key: 'accounts.manage.core', disabledAncestor: 'accounts' },
        ]);
    });

    it('ignores children left at their default and children set to false', () => {
        expect(findShadowedFeatureFlags({ rules: 'false', 'rules.approve': 'false' })).toEqual([]);
    });

    it('reports nothing when every ancestor is on', () => {
        expect(findShadowedFeatureFlags({ rules: 'true', 'rules.create': 'true' })).toEqual([]);
    });
});
