import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { GetFileReplicasMetalinkControllerParameters } from '@/lib/infrastructure/controller/get-file-replicas-metalink-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { parseFileReplicasOptions } from '@/lib/infrastructure/adapters/parse-file-replicas-options';

/**
 * GET /api/feature/get-file-replicas-metalink
 * Query params: scope, name, and the same options as list-file-replicas
 * (schemes, domain, rseExpression, allStates)
 * Returns { status, xml } with the metalink4 document of the DID's file replicas
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const scope = params.scope as string;
        const name = params.name as string;

        if (!scope || !name) {
            return NextResponse.json({ error: 'Missing required parameters: scope and name' }, { status: 400 });
        }

        const controller = appContainer.get<BaseController<GetFileReplicasMetalinkControllerParameters, void>>(
            CONTROLLERS.GET_FILE_REPLICAS_METALINK,
        );

        return executeAuthenticatedController(controller, { scope, name, ...parseFileReplicasOptions(request, params) });
    } catch (error) {
        console.error('Error in get-file-replicas-metalink:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
