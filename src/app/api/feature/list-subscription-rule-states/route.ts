import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListSubscriptionRuleStatesControllerParameters } from '@/lib/infrastructure/controller/list-subscription-rule-states-controller';
import { executeAuthenticatedController } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';

/**
 * GET /api/feature/list-subscription-rule-states
 * Query params: account, name
 * Returns rule states for subscriptions of the authenticated user's account
 */
export async function GET(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const account = sessionUser.rucioAccount;
        if (!account) {
            return NextResponse.json(
                { error: 'Could not determine account name. Are you logged in?' },
                { status: 400 }
            );
        }

        const controller = appContainer.get<BaseController<ListSubscriptionRuleStatesControllerParameters, void>>(
            CONTROLLERS.LIST_SUBSCRIPTION_RULE_STATES
        );

        return executeAuthenticatedController(controller, { account }, true);
    } catch (error) {
        console.error('Error in list-subscription-rule-states:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
