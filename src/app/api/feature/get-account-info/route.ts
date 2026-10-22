import 'reflect-metadata';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { GetAccountInfoControllerParameters } from '@/lib/infrastructure/controller/get-account-info-controller';
import { executeAuthenticatedController } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withAccountReadAccess } from '@/lib/infrastructure/adapters/with-admin';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { ACCOUNT_NAME_REGEX } from '@/lib/core/utils/account-validation';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/feature/get-account-info?account=<name>
 * Returns account information. `account` defaults to the session account.
 * Admins may read any account; other users only their own (enforced by withAccountReadAccess).
 */
async function getHandler(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requested = request.nextUrl.searchParams.get('account');
        if (requested && !ACCOUNT_NAME_REGEX.test(requested)) {
            return NextResponse.json({ status: 'error', errorType: 'validation_error', message: 'Invalid account name' }, { status: 400 });
        }
        const account = requested || sessionUser.rucioAccount;
        const controller = appContainer.get<BaseController<GetAccountInfoControllerParameters, void>>(CONTROLLERS.GET_ACCOUNT_INFO);

        return executeAuthenticatedController(controller, { account });
    } catch (error) {
        console.error('Error in get-account-info:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export const GET = withAccountReadAccess(getHandler);
