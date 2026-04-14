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
 * Query params: account (optional - defaults to authenticated user's account), name
 * Returns rule states for subscriptions of the specified account
 */
export async function GET(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check for account query parameter first, fall back to session user's account
        const { searchParams } = new URL(request.url);
        const accountParam = searchParams.get('account');
        const account = accountParam || sessionUser.rucioAccount;

        if (!account) {
            return NextResponse.json({ error: 'Could not determine account name. Are you logged in?' }, { status: 400 });
        }

        const controller = appContainer.get<BaseController<ListSubscriptionRuleStatesControllerParameters, void>>(
            CONTROLLERS.LIST_SUBSCRIPTION_RULE_STATES,
        );

        return executeAuthenticatedController(controller, { account }, true);
    } catch (error) {
        console.error('Error in list-subscription-rule-states:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
