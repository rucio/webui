import 'reflect-metadata';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { GetAccountInfoControllerParameters } from '@/lib/infrastructure/controller/get-account-info-controller';
import { executeAuthenticatedController } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { NextResponse } from 'next/server';

/**
 * GET /api/feature/get-account-info
 * Returns account information for the current authenticated user
 */
export async function GET() {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const account = sessionUser.rucioAccount;
        const controller = appContainer.get<BaseController<GetAccountInfoControllerParameters, void>>(
            CONTROLLERS.GET_ACCOUNT_INFO
        );

        return executeAuthenticatedController(controller, { account });
    } catch (error) {
        console.error('Error in get-account-info:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
