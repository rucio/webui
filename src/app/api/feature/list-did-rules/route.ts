import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListDIDRulesControllerParameters } from '@/lib/infrastructure/controller/list-did-rules-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';

/**
 * GET /api/feature/list-did-rules
 * Query params: scope, name
 * Returns the replication rules associated with a DID
 */
export async function GET(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!sessionUser.rucioAccount) {
            return NextResponse.json({ error: 'Invalid Session. No Rucio Account found' }, { status: 400 });
        }

        const params = parseQueryParams(request);
        const scope = params.scope as string;
        const name = params.name as string;

        if (!scope || !name) {
            return NextResponse.json({ error: 'Missing required parameters: scope and name' }, { status: 400 });
        }

        const controller = appContainer.get<BaseController<ListDIDRulesControllerParameters, void>>(CONTROLLERS.LIST_DID_RULES);

        return executeAuthenticatedController(
            controller,
            {
                scope,
                name,
                sessionAccount: sessionUser.rucioAccount,
            },
            true, // streaming endpoint
        );
    } catch (error) {
        console.error('Error in list-did-rules:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
