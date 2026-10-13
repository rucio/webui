import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { GetAccountQuotasControllerParameters } from '@/lib/infrastructure/controller/get-account-quotas-controller';
import { executeAuthenticatedController } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import { withAccountReadAccess } from '@/lib/infrastructure/adapters/with-admin';
import { ACCOUNT_NAME_REGEX } from '@/lib/core/utils/account-validation';

const QuerySchema = z.object({ account: z.string().regex(ACCOUNT_NAME_REGEX) });

/**
 * GET /api/feature/get-account-quotas?account=<name>
 * Admins may read any account; other users only their own (enforced by withAccountReadAccess).
 */
async function getHandler(request: NextRequest) {
    const params = QuerySchema.safeParse({ account: request.nextUrl.searchParams.get('account') });
    if (!params.success) {
        return NextResponse.json({ status: 'error', errorType: 'validation_error', message: 'Invalid account name' }, { status: 400 });
    }
    const controller = appContainer.get<BaseController<GetAccountQuotasControllerParameters, void>>(CONTROLLERS.GET_ACCOUNT_QUOTAS);
    return executeAuthenticatedController(controller, { account: params.data.account });
}

export const GET = withFeature(CONTROLLERS.GET_ACCOUNT_QUOTAS, withAccountReadAccess(getHandler));
