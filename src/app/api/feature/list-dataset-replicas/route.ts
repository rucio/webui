import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListDatasetReplicasControllerParameters } from '@/lib/infrastructure/controller/list-dataset-replicas-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

/**
 * GET /api/feature/list-dataset-replicas
 * Query params: scope, name
 * Returns the replicas of a dataset DID
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

        const controller = appContainer.get<BaseController<ListDatasetReplicasControllerParameters, void>>(
            CONTROLLERS.LIST_DATASET_REPLICAS
        );

        return executeAuthenticatedController(controller, { scope, name }, true);
    } catch (error) {
        console.error('Error in list-dataset-replicas:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
