import { getFeatureFlagAssignments, IFeature } from '@/lib/sdk/ioc-helpers';
import { FEATURE_REGISTRY } from '@/lib/core/entity/feature-config';

function fake(name: string, featureFlag?: string): IFeature {
    return { name, featureFlag, load: () => undefined };
}

describe('getFeatureFlagAssignments', () => {
    it('collects only features that declare a flag', () => {
        const map = getFeatureFlagAssignments([fake('CreateRule', 'rules.create'), fake('Ping')]);
        expect(map).toEqual({ CreateRule: 'rules.create' });
    });

    it('every declared flag is a valid registry key', () => {
        const map = getFeatureFlagAssignments([fake('CreateRule', 'rules.create'), fake('ListRSEs', 'rses')]);
        const validKeys = Object.keys(FEATURE_REGISTRY);
        Object.values(map).forEach(flag => expect(validKeys).toContain(flag));
    });
});
