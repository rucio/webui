import { FeatureKey, FeatureFlagMap } from '@/lib/core/entity/feature-config';

export default interface FeatureConfigGatewayOutputPort {
    /** Effective value for one feature (default + env + hierarchy). */
    isEnabled(key: FeatureKey): Promise<boolean>;
    /** True if ANY of the given features is enabled (OR-logic for shared routes). */
    isAnyEnabled(keys: FeatureKey[]): Promise<boolean>;
    /** The full resolved map, for server-side injection into the client. */
    enabledSet(): Promise<FeatureFlagMap>;
}
