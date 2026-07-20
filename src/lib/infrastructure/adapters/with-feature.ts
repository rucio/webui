import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import FeatureConfigGatewayOutputPort from '@/lib/core/port/secondary/feature-config-gateway-output-port';
import { FeatureKey } from '@/lib/core/entity/feature-config';

export type RouteHandler = (request: NextRequest, ...rest: any[]) => Promise<Response> | Response;

/**
 * Wraps a Next.js App Router route handler so that it returns 404 when none of
 * the given feature flags are enabled. 404 (not 403) so a disabled feature
 * appears nonexistent. Multiple keys are OR-ed (for routes shared by features).
 */
export function withFeature(flags: FeatureKey | FeatureKey[], handler: RouteHandler): RouteHandler {
    const keys = Array.isArray(flags) ? flags : [flags];
    return async (request: NextRequest, ...rest: any[]) => {
        const gateway = appContainer.get<FeatureConfigGatewayOutputPort>(GATEWAYS.FEATURE_CONFIG);
        const enabled = await gateway.isAnyEnabled(keys);
        if (!enabled) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return handler(request, ...rest);
    };
}
