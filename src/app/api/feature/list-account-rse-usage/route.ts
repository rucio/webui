import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListAccountRSEUsageControllerParameters } from '@/lib/infrastructure/controller/list-account-rse-usage-controller';
import { ListAccountRSEUsageRequest } from '@/lib/core/usecase-models/list-account-rse-usage-usecase-models';
import { executeAuthenticatedController } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';

/**
 * GET /api/feature/list-account-rse-usage
 * Returns RSE usage information for the authenticated user's account
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

        const controller = appContainer.get<BaseController<ListAccountRSEUsageControllerParameters, ListAccountRSEUsageRequest>>(
            CONTROLLERS.LIST_ACCOUNT_RSE_USAGE
        );

        return executeAuthenticatedController(
            controller,
            {
                account: sessionUser.rucioAccount
            },
            true // streaming endpoint
        );
    } catch (error) {
        console.error('Error in list-account-rse-usage:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
