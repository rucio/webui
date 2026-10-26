import { CONTROLLER_FLAG_MAP } from '@/lib/infrastructure/ioc/container-config';
import { FEATURE_REGISTRY } from '@/lib/core/entity/feature-config';

describe('CONTROLLER_FLAG_MAP coverage', () => {
    const allFlags = Array.from(CONTROLLER_FLAG_MAP.values()).flat();
    const registryKeys = Object.keys(FEATURE_REGISTRY);

    it('every flag referenced by a feature is a known registry key', () => {
        allFlags.forEach(flag => expect(registryKeys).toContain(flag));
    });

    // A parent-only key (e.g. accounts.manage, the switch for its accounts.manage.* areas) has no route of its own:
    // it gates routes through its children, so it counts as claimed when one of its descendants is.
    const isClaimed = (key: string): boolean =>
        allFlags.includes(key) || Object.entries(FEATURE_REGISTRY).some(([child, def]) => 'parent' in def && def.parent === key && isClaimed(child));

    it('every registry key is claimed by at least one feature, directly or through a child', () => {
        registryKeys.forEach(key => expect({ key, claimed: isClaimed(key) }).toEqual({ key, claimed: true }));
    });

    it('every accounts.manage area is claimed directly', () => {
        ['accounts.manage.core', 'accounts.manage.identities', 'accounts.manage.attributes', 'accounts.manage.quotas'].forEach(key =>
            expect(allFlags).toContain(key),
        );
    });
});
