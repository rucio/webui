import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListDIDContentsControllerParameters } from '@/lib/infrastructure/controller/list-did-contents-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';

/**
 * GET /api/feature/list-did-contents
 * Query params: scope, name
 * Returns the contents of a DID (Data Identifier)
 */
export async function GET(request: NextRequest) {
    try {
        const params = parseQueryParams(request);
        const scope = params.scope as string;
        const name = params.name as string;

        if (!scope) {
            return NextResponse.json({ error: 'Missing required parameter: scope' }, { status: 400 });
        }

        if (!name) {
            return NextResponse.json({ error: 'Missing required parameter: name' }, { status: 400 });
        }

        const controller = appContainer.get<BaseController<ListDIDContentsControllerParameters, void>>(CONTROLLERS.LIST_DID_CONTENTS);

        return executeAuthenticatedController(controller, { scope, name }, true);
    } catch (error) {
        console.error('Error in list-did-contents:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
