import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListRSEsControllerParameters } from '@/lib/infrastructure/controller/list-rses-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

/**
 * GET /api/feature/list-rses
 * Query params: rseExpression (optional)
 * Returns a list of RSEs matching the expression
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        // Controller expects rseExpression to be a string, default to empty string
        const rseExpression = (params.rseExpression as string) || '';

        const controller = appContainer.get<BaseController<ListRSEsControllerParameters, void>>(CONTROLLERS.LIST_RSES);

        return executeAuthenticatedController(controller, { rseExpression }, true);
    } catch (error) {
        console.error('Error in list-rses:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
