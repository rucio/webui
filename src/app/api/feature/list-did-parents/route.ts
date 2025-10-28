import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListDIDParentsControllerParameters } from '@/lib/infrastructure/controller/list-did-parents-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

/**
 * GET /api/feature/list-did-parents
 * Query params: scope, name
 * Returns the parent DIDs of a given DID
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const scope = params.scope as string;
        const name = params.name as string;

        if (!scope || !name) {
            return NextResponse.json(
                { error: 'Missing required parameters: scope and name' },
                { status: 400 }
            );
        }

        const controller = appContainer.get<BaseController<ListDIDParentsControllerParameters, void>>(
            CONTROLLERS.LIST_DID_PARENTS
        );

        return executeAuthenticatedController(controller, { scope, name }, true);
    } catch (error) {
        console.error('Error in list-did-parents:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
