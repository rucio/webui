import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { OpenDataDIDControllerParameters } from '@/lib/infrastructure/controller/opendata-did-controller';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';

/**
 * GET /api/feature/get-opendata-did
 * Query params: scope, name
 */
async function getHandler(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const scope = params.scope as string;
        const name = params.name as string;

        if (!scope || !name) {
            return NextResponse.json({ error: 'Missing required parameters: scope and name' }, { status: 400 });
        }

        const controller = appContainer.get<BaseController<OpenDataDIDControllerParameters, void>>(CONTROLLERS.OPENDATA_DID);

        return executeAuthenticatedController(controller, { scope, name });
    } catch (error) {
        console.error('Error in get-opendata-did:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const GET = withFeature(CONTROLLERS.OPENDATA_DID, getHandler);
