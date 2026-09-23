import { injectable } from 'inversify';
import FeatureConfigGatewayOutputPort from '@/lib/core/port/secondary/feature-config-gateway-output-port';
import { FeatureKey, FeatureFlagMap, resolveEnabledSet, readFeatureEnv } from '@/lib/core/entity/feature-config';

@injectable()
class FeatureConfigGateway implements FeatureConfigGatewayOutputPort {
    private readRawEnv(): Partial<Record<FeatureKey, string | undefined>> {
        return readFeatureEnv(process.env);
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
