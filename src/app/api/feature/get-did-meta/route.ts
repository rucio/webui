import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { DIDMetaControllerParameters } from '@/lib/infrastructure/controller/did-meta-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';

/**
 * GET /api/feature/get-did-meta
 * Query params: scope, name
 * Returns metadata for a specific DID (Data Identifier)
 */
async function getHandler(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const scope = params.scope as string;
        const name = params.name as string;

        if (!scope || !name) {
            return NextResponse.json({ error: 'Missing required parameters: scope and name' }, { status: 400 });
        }

        const controller = appContainer.get<BaseController<DIDMetaControllerParameters, void>>(CONTROLLERS.DID_META);

        return executeAuthenticatedController(controller, { scope, name });
    } catch (error) {
        console.error('Error in get-did-meta:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const GET = withFeature('dids.metadata', getHandler);
