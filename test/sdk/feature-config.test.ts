import {
    FEATURE_REGISTRY,
    FeatureKey,
    resolveFeatureEnabled,
    resolveEnabledSet,
    envKeyForFeature,
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

    it('resolveEnabledSet returns a boolean for every registry key', () => {
        const set = resolveEnabledSet({});
        const keys = Object.keys(FEATURE_REGISTRY) as FeatureKey[];
        keys.forEach(k => expect(typeof set[k]).toBe('boolean'));
        expect(Object.keys(set).sort()).toEqual(keys.sort());
    });
});
