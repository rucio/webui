import { CONTROLLER_FLAG_MAP } from '@/lib/infrastructure/ioc/container-config';
import { FEATURE_REGISTRY } from '@/lib/core/entity/feature-config';

describe('CONTROLLER_FLAG_MAP coverage', () => {
    const allFlags = Array.from(CONTROLLER_FLAG_MAP.values()).flat();
    const registryKeys = Object.keys(FEATURE_REGISTRY);

    it('every flag referenced by a feature is a known registry key', () => {
        allFlags.forEach(flag => expect(registryKeys).toContain(flag));
    });

    it('every registry key is claimed by at least one feature', () => {
        registryKeys.forEach(key => expect(allFlags).toContain(key));
    });
});
