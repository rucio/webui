import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { withFeature } from '@/lib/infrastructure/adapters/with-feature';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';
import GetSubscriptionByIdController from '@/lib/infrastructure/controller/get-subscription-by-id-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { NextRequest, NextResponse } from 'next/server';

async function getHandler(request: NextRequest) {
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!sessionUser.rucioAccount) {
        return NextResponse.json({ error: 'Unauthorized Rucio account is not set' }, { status: 401 });
    }

    const params = parseQueryParams(request);
    const id = params.id as string;

    if (!id) {
        return NextResponse.json({ error: 'Missing required parameter: id' }, { status: 400 });
    }

    const controller: GetSubscriptionByIdController = appContainer.get(CONTROLLERS.GET_SUBSCRIPTION_BY_ID);

    return executeAuthenticatedController(controller, { id });
}

export const GET = withFeature(CONTROLLERS.GET_SUBSCRIPTION_BY_ID, getHandler);
