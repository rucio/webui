import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { ListRulesPendingApprovalControllerParameters } from '@/lib/infrastructure/controller/list-rules-pending-approval-controller';
import { ListRulesPendingApprovalRequest } from '@/lib/core/usecase-models/list-rules-pending-approval-usecase-models';
import { executeAuthenticatedController, parseQueryParams } from '@/lib/infrastructure/adapters/app-router-controller-adapter';
import { getSessionUser } from '@/lib/infrastructure/auth/nextauth-session-utils';

const FiltersSchema = z.object({
    scope: z.string().optional(),
    name: z.string().optional(),
    updated_after: z.string().datetime().optional(),
    updated_before: z.string().datetime().optional(),
    account: z.string().optional(),
    activity: z.string().optional(),
});

/**
 * GET /api/feature/list-rules-pending-approval
 * Query params: scope, name, updated_after, updated_before, account, activity
 * Returns a list of rules pending approval with extended metadata and DID enrichment.
 */
export async function GET(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const params = parseQueryParams(request);

        const validationResult = FiltersSchema.safeParse(params);
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

        const controller = appContainer.get<
            BaseController<ListRulesPendingApprovalControllerParameters, ListRulesPendingApprovalRequest>
        >(CONTROLLERS.LIST_RULES_PENDING_APPROVAL);

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
        console.error('Error in list-rules-pending-approval:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
