import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { GetFTSLinkControllerParameters } from '@/lib/infrastructure/controller/get-fts-link-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

/**
 * GET /api/feature/get-fts-link
 * Query params: scope, name, rse
 * Returns FTS (File Transfer Service) link information
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const scope = params.scope as string;
        const name = params.name as string;
        const rse = params.rse as string;

        if (!scope) {
            return NextResponse.json({ error: 'Missing required parameter: scope' }, { status: 400 });
        }

        if (!name) {
            return NextResponse.json({ error: 'Missing required parameter: name' }, { status: 400 });
        }

        if (!rse) {
            return NextResponse.json({ error: 'Missing required parameter: rse' }, { status: 400 });
        }

        const controller = appContainer.get<BaseController<GetFTSLinkControllerParameters, void>>(CONTROLLERS.GET_FTS_LINK);

        return executeAuthenticatedController(controller, { scope, name, rse });
    } catch (error) {
        console.error('Error in get-fts-link:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
