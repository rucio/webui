import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { GetRSEControllerParameters } from '@/lib/infrastructure/controller/get-rse-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

/**
 * GET /api/feature/get-rse
 * Query params: rseName
 * Returns information about a specific Rucio Storage Element (RSE)
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const rseName = params.rseName as string;

        if (!rseName) {
            return NextResponse.json({ error: 'Missing required parameter: rseName' }, { status: 400 });
        }

        const controller = appContainer.get<BaseController<GetRSEControllerParameters, void>>(CONTROLLERS.GET_RSE);

        return executeAuthenticatedController(controller, { rseName });
    } catch (error) {
        console.error('Error in get-rse:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
