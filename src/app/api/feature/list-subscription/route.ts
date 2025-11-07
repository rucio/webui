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
 * Query params: account (optional) - defaults to session account if not provided
 * Returns a list of subscriptions as NDJSON stream
 *
 * WebUI Tutorial: This endpoint is used in the Developer Onboarding Tutorial
 * to demonstrate the list-subscriptions feature.
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

        // Parse query params - account defaults to session account if not provided
        const params = parseQueryParams(request);
        const account = (params.account as string) || sessionUser.rucioAccount;

        const controller = appContainer.get<BaseController<ListSubscriptionsControllerParameters, void>>(
            CONTROLLERS.LIST_SUBSCRIPTIONS
        );

        return executeAuthenticatedController(
            controller,
            {
                sessionAccount: account
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
