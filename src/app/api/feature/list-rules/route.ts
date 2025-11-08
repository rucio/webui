import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListRulesControllerParameters } from '@/lib/infrastructure/controller/list-rules-controller';
import { ListRulesRequest } from '@/lib/core/usecase-models/list-rules-usecase-models';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';
import { RuleState } from '@/lib/core/entity/rucio';

const RulesFiltersSchema = z.object({
    scope: z.string().optional(),
    name: z.string().optional(),
    updated_after: z.string().datetime().optional(),
    updated_before: z.string().datetime().optional(),
    state: z
        .enum([RuleState.REPLICATING, RuleState.OK, RuleState.STUCK, RuleState.SUSPENDED, RuleState.WAITING_APPROVAL, RuleState.INJECT])
        .optional(),
    account: z.string().optional(),
    activity: z.string().optional(),
});

/**
 * GET /api/feature/list-rules
 * Query params: scope, name, updated_after, updated_before, state, account, activity
 * Returns a list of replication rules based on filters
 */
export async function GET(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentAccount = sessionUser.rucioAccount;
        const params = parseQueryParams(request);

        // Validate query parameters against the schema
        const validationResult = RulesFiltersSchema.safeParse(params);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Invalid query parameters',
                    details: validationResult.error.errors,
                },
                { status: 400 },
            );
        }

        const filters = validationResult.data;

        // Ensure that the account filter is set to the current user's account if not provided
        if (!filters.account) {
            filters.account = currentAccount;
        }

        const controller = appContainer.get<BaseController<ListRulesControllerParameters, ListRulesRequest>>(CONTROLLERS.LIST_RULES);

        return executeAuthenticatedController(
            controller,
            {
                filters: {
                    ...filters,
                    updated_after: filters.updated_after ? new Date(filters.updated_after) : undefined,
                    updated_before: filters.updated_before ? new Date(filters.updated_before) : undefined,
                },
            },
            true, // streaming endpoint
        );
    } catch (error) {
        console.error('Error in list-rules:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
