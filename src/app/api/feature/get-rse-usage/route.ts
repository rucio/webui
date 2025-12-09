import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { GetRSEUsageControllerParameters } from '@/lib/infrastructure/controller/get-rse-usage-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

/**
 * GET /api/feature/get-rse-usage
 * Query params: rse
 * Returns storage usage information for a specific RSE
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const rseName = (params.rse as string) || (params.rseName as string);

        if (!rseName) {
            return NextResponse.json({ error: 'Missing required parameter: rse or rseName' }, { status: 400 });
        }

        const controller = appContainer.get<BaseController<GetRSEUsageControllerParameters, void>>(CONTROLLERS.GET_RSE_USAGE);

        return executeAuthenticatedController(controller, { rseName });
    } catch (error) {
        console.error('Error in get-rse-usage:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
