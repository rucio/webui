import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListFileReplicasControllerParameters } from '@/lib/infrastructure/controller/list-file-replicas-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { parseFileReplicasOptions } from '@/lib/infrastructure/adapters/parse-file-replicas-options';

/**
 * GET /api/feature/list-file-replicas
 * Query params: scope, name, and the optional `rucio replica list file` options
 * schemes (repeatable or comma separated), domain, rseExpression, allStates
 * Streams one element per PFN of every file replica of the DID
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const scope = params.scope as string;
        const name = params.name as string;

        if (!scope || !name) {
            return NextResponse.json({ error: 'Missing required parameters: scope and name' }, { status: 400 });
        }

        const controller = appContainer.get<BaseController<ListFileReplicasControllerParameters, void>>(CONTROLLERS.LIST_FILE_REPLICAS);

        return executeAuthenticatedController(controller, { scope, name, ...parseFileReplicasOptions(request, params) }, true);
    } catch (error) {
        console.error('Error in list-file-replicas:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
