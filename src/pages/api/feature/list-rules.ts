import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { ListRulesControllerParameters } from '@/lib/infrastructure/controller/list-rules-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { ListRulesRequest } from '@/lib/core/usecase-models/list-rules-usecase-models';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';
import { SessionUser } from '@/lib/core/entity/auth-models';
import { z } from 'zod';
import { RuleState } from '@/lib/core/entity/rucio';

const RulesFiltersSchema = z.object({
    scope: z.string().optional(),
    name: z.string().optional(),
    updated_after: z.string().datetime().optional(),
    updated_before: z.string().datetime().optional(),
    // Excluding unknown, as this is not a valid filter
    state: z
        .enum([RuleState.REPLICATING, RuleState.OK, RuleState.STUCK, RuleState.SUSPENDED, RuleState.WAITING_APPROVAL, RuleState.INJECT])
        .optional(),
    account: z.string().optional(),
    activity: z.string().optional(),
});

async function listRules(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    if (!sessionUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const currentAccount = sessionUser.rucioAccount;

    // Validate query parameters against the schema
    const validationResult = RulesFiltersSchema.safeParse(req.query);
    if (!validationResult.success) {
        res.status(400).json({ error: 'Invalid query parameters', details: validationResult.error.errors });
        return;
    }

    const filters = validationResult.data;

    // Ensure that the account filter is set to the current user's account if not provided
    if (!filters.account) {
        filters.account = currentAccount;
    }

    const controllerParameters: ListRulesControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        filters: {
            ...filters,
            updated_after: filters.updated_after ? new Date(filters.updated_after) : undefined,
            updated_before: filters.updated_before ? new Date(filters.updated_before) : undefined,
        },
    };

    const controller = appContainer.get<BaseController<ListRulesControllerParameters, ListRulesRequest>>(CONTROLLERS.LIST_RULES);
    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(listRules);
