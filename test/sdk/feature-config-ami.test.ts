import { FEATURE_REGISTRY, envKeyForFeature, isFeatureEnabledInEnv, resolveEnabledSet } from '@/lib/core/entity/feature-config';

describe('dids.ami_tags flag', () => {
    it('is registered with env FEATURE_DIDS_AMI_TAGS', () => {
        expect(FEATURE_REGISTRY['dids.ami_tags']).toEqual({ default: false, pages: [] });
        expect(envKeyForFeature('dids.ami_tags')).toBe('FEATURE_DIDS_AMI_TAGS');
    });

    it('defaults to disabled', () => {
        expect(resolveEnabledSet({})['dids.ami_tags']).toBe(false);
        expect(isFeatureEnabledInEnv('dids.ami_tags', {})).toBe(false);
    });

    it('is enabled by a truthy env value', () => {
        expect(isFeatureEnabledInEnv('dids.ami_tags', { FEATURE_DIDS_AMI_TAGS: 'true' })).toBe(true);
        expect(isFeatureEnabledInEnv('dids.ami_tags', { FEATURE_DIDS_AMI_TAGS: 'off' })).toBe(false);
    });

    it('isFeatureEnabledInEnv respects parent cascade for other keys', () => {
        expect(isFeatureEnabledInEnv('rules.create', { FEATURE_RULES: 'false' })).toBe(false);
        expect(isFeatureEnabledInEnv('rules.create', {})).toBe(true);
    });
});
