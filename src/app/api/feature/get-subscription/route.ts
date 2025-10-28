import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import GetSubscriptionController, { GetSubscriptionControllerParameters } from '@/lib/infrastructure/controller/get-subscription-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';

/**
 * GET /api/feature/get-subscription
 * Query params: account, name
 * Returns details of a specific subscription
 */
export async function GET(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!sessionUser.rucioAccount) {
            return NextResponse.json(
                { error: 'Unauthorized: Rucio Account is not set' },
                { status: 401 }
            );
        }

        const params = parseQueryParams(request);
        const account = params.account as string;
        const name = params.name as string;

        if (!account) {
            return NextResponse.json(
                { error: 'Missing required parameter: account' },
                { status: 400 }
            );
        }

        if (!name) {
            return NextResponse.json(
                { error: 'Missing required parameter: name' },
                { status: 400 }
            );
        }

        const controller: GetSubscriptionController = appContainer.get(CONTROLLERS.GET_SUBSCRIPTION);

        return executeAuthenticatedController(controller, {
            name,
            sessionAccount: sessionUser.rucioAccount
        });
    } catch (error) {
        console.error('Error in get-subscription:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
