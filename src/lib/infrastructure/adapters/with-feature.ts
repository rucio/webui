import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer, { CONTROLLER_FLAG_MAP } from '@/lib/infrastructure/ioc/container-config';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import FeatureConfigGatewayOutputPort from '@/lib/core/port/secondary/feature-config-gateway-output-port';
import { FeatureKey } from '@/lib/core/entity/feature-config';

export type RouteHandler = (request: NextRequest, ...rest: any[]) => Promise<Response> | Response;

/**
 * Wraps a route handler; returns 404 when none of the flags mapped to this
 * controller are enabled. An unmapped controller (no declared flag) is ungated.
 */
export function withFeature(controllerSymbol: symbol, handler: RouteHandler): RouteHandler {
    return async (request: NextRequest, ...rest: any[]) => {
        const flags = (CONTROLLER_FLAG_MAP.get(controllerSymbol) ?? []) as FeatureKey[];
        if (flags.length === 0) {
            return handler(request, ...rest);
        }
        const gateway = appContainer.get<FeatureConfigGatewayOutputPort>(GATEWAYS.FEATURE_CONFIG);
        const enabled = await gateway.isAnyEnabled(flags);
        if (!enabled) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return handler(request, ...rest);
    };
}
