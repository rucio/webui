import { FEATURE_REGISTRY, envKeyForFeature, isFeatureEnabledInEnv } from '@/lib/core/entity/feature-config';

describe('dids.panda_task flag', () => {
    it('is registered, off by default, with env FEATURE_DIDS_PANDA_TASK', () => {
        expect(FEATURE_REGISTRY['dids.panda_task']).toEqual({ default: false, pages: [] });
        expect(envKeyForFeature('dids.panda_task')).toBe('FEATURE_DIDS_PANDA_TASK');
        expect(isFeatureEnabledInEnv('dids.panda_task', {})).toBe(false);
        expect(isFeatureEnabledInEnv('dids.panda_task', { FEATURE_DIDS_PANDA_TASK: 'true' })).toBe(true);
    });
});
