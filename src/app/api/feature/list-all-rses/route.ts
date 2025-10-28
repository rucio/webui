import 'reflect-metadata';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListAllRSEsControllerParameters } from '@/lib/infrastructure/controller/list-all-rses-controller';
import { executeAuthenticatedController } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

/**
 * GET /api/feature/list-all-rses
 * Returns a list of all Rucio Storage Elements (RSEs)
 */
export async function GET() {
    try {
        const controller = appContainer.get<BaseController<ListAllRSEsControllerParameters, void>>(
            CONTROLLERS.LIST_ALL_RSES
        );

        return executeAuthenticatedController(controller, {}, true);
    } catch (error) {
        console.error('Error in list-all-rses:', error);
        const { NextResponse } = await import('next/server');
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
