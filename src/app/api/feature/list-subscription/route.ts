import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListSubscriptionsControllerParameters } from '@/lib/infrastructure/controller/list-subscriptions-controller';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';

/**
 * GET /api/feature/list-subscription
 * Query params: account (optional), name (optional)
 * Returns a list of subscriptions
 */
export async function GET(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!sessionUser.rucioAccount) {
            return NextResponse.json(
                { error: 'Invalid Session. No Rucio Account found' },
                { status: 400 }
            );
        }

        const params = parseQueryParams(request);
        const account = params.account as string;

        if (!account) {
            return NextResponse.json(
                { error: 'Missing required parameter: account' },
                { status: 400 }
            );
        }

        const controller = appContainer.get<BaseController<ListSubscriptionsControllerParameters, void>>(
            CONTROLLERS.LIST_SUBSCRIPTIONS
        );

        return executeAuthenticatedController(
            controller,
            {
                sessionAccount: sessionUser.rucioAccount
            },
            true // streaming endpoint
        );
    } catch (error) {
        console.error('Error in list-subscription:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
