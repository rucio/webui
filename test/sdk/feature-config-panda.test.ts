import { FEATURE_REGISTRY, envKeyForFeature, isFeatureEnabledInEnv, resolveEnabledSet } from '@/lib/core/entity/feature-config';

describe('dids.panda_task flag', () => {
    it('is registered with env FEATURE_DIDS_PANDA_TASK', () => {
        expect(FEATURE_REGISTRY['dids.panda_task']).toEqual({ default: false, pages: [] });
        expect(envKeyForFeature('dids.panda_task')).toBe('FEATURE_DIDS_PANDA_TASK');
    });

    it('defaults to disabled', () => {
        expect(resolveEnabledSet({})['dids.panda_task']).toBe(false);
        expect(isFeatureEnabledInEnv('dids.panda_task', {})).toBe(false);
    });

    it('is enabled by a truthy env value', () => {
        expect(isFeatureEnabledInEnv('dids.panda_task', { FEATURE_DIDS_PANDA_TASK: 'true' })).toBe(true);
        expect(isFeatureEnabledInEnv('dids.panda_task', { FEATURE_DIDS_PANDA_TASK: 'off' })).toBe(false);
    });

    it('is independent of the AMI tags flag', () => {
        const pandaOnly = resolveEnabledSet({ 'dids.panda_task': 'true' });
        expect(pandaOnly['dids.panda_task']).toBe(true);
        expect(pandaOnly['dids.ami_tags']).toBe(false);

        const amiOnly = resolveEnabledSet({ 'dids.ami_tags': 'true' });
        expect(amiOnly['dids.ami_tags']).toBe(true);
        expect(amiOnly['dids.panda_task']).toBe(false);
    });
});
