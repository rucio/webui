import { injectable } from 'inversify';
import FeatureConfigGatewayOutputPort from '@/lib/core/port/secondary/feature-config-gateway-output-port';
import { FEATURE_REGISTRY, FeatureKey, FeatureFlagMap, resolveEnabledSet, envKeyForFeature } from '@/lib/core/entity/feature-config';

@injectable()
class FeatureConfigGateway implements FeatureConfigGatewayOutputPort {
    private readRawEnv(): Partial<Record<FeatureKey, string | undefined>> {
        const raw = {} as Partial<Record<FeatureKey, string | undefined>>;
        (Object.keys(FEATURE_REGISTRY) as FeatureKey[]).forEach(key => {
            raw[key] = process.env[envKeyForFeature(key)];
        });
        return raw;
    }

    async enabledSet(): Promise<FeatureFlagMap> {
        return Promise.resolve(resolveEnabledSet(this.readRawEnv()));
    }

    async isEnabled(key: FeatureKey): Promise<boolean> {
        const set = await this.enabledSet();
        return set[key];
    }

    async isAnyEnabled(keys: FeatureKey[]): Promise<boolean> {
        const set = await this.enabledSet();
        return keys.some(k => set[k]);
    }
}

export default FeatureConfigGateway;
