import 'server-only';
import 'reflect-metadata';
import { notFound } from 'next/navigation';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import FeatureConfigGatewayOutputPort from '@/lib/core/port/secondary/feature-config-gateway-output-port';
import { FeatureKey } from '@/lib/core/entity/feature-config';

/**
 * Server-only guard: renders the Next 404 page when the feature is disabled.
 * Call at the top of a gated page's server component: `await requireFeature('rules')`.
 */
export async function requireFeature(key: FeatureKey): Promise<void> {
    const gateway = appContainer.get<FeatureConfigGatewayOutputPort>(GATEWAYS.FEATURE_CONFIG);
    const enabled = await gateway.isEnabled(key);
    if (!enabled) {
        notFound();
    }
}
