import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListAccountIdentitiesControllerParameters } from '@/lib/infrastructure/controller/list-account-identities-controller';
import { executeAuthenticatedController } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import { withAccountReadAccess } from '@/lib/infrastructure/adapters/with-admin';
import { ACCOUNT_NAME_REGEX } from '@/lib/core/utils/account-validation';

const QuerySchema = z.object({ account: z.string().regex(ACCOUNT_NAME_REGEX) });

/**
 * GET /api/feature/list-account-identities?account=<name>
 * Admins may read any account; other users only their own (enforced by withAccountReadAccess).
 */
async function getHandler(request: NextRequest) {
    const params = QuerySchema.safeParse({ account: request.nextUrl.searchParams.get('account') });
    if (!params.success) {
        return NextResponse.json({ status: 'error', errorType: 'validation_error', message: 'Invalid account name' }, { status: 400 });
    }
    const controller = appContainer.get<BaseController<ListAccountIdentitiesControllerParameters, void>>(CONTROLLERS.LIST_ACCOUNT_IDENTITIES);
    return executeAuthenticatedController(controller, { account: params.data.account });
}

export const GET = withFeature(CONTROLLERS.LIST_ACCOUNT_IDENTITIES, withAccountReadAccess(getHandler));
