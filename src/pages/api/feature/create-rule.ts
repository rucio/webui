import { SessionUser } from '@/lib/core/entity/auth-models';

import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { CreateRuleControllerParameters } from '@/lib/infrastructure/controller/create-rule-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { CreateRuleRequest } from '@/lib/core/usecase-models/create-rule-usecase-models';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';

const schema = z.object({
    dids: z
        .array(
            z.object({
                scope: z.string().min(1),
                name: z.string().min(1),
            }),
        )
        .nonempty(),
    copies: z.number().min(1),
    rse_expression: z.string().min(1),
    grouping: z.enum(['ALL', 'DATASET', 'NONE']).optional(),
    lifetime_days: z.number().int().positive().optional(),
    notify: z.boolean().optional(),
    comments: z.string().optional(),
    ask_approval: z.boolean().optional(),
    asynchronous: z.boolean().optional(),
    sample: z.boolean().optional(),
    sample_file_count: z.number().int().positive().optional(),
});

async function createRule(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    if (!sessionUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const params = schema.safeParse(req.body);
    if (!params.success) {
        // TODO: more detailed response
        res.status(400).json({ error: 'Missing required parameters or provided parameters are invalid' });
        return;
    }

    const controllerParameters: CreateRuleControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        account: sessionUser.rucioAccount,
        ...params.data,
    };

    const controller = appContainer.get<BaseController<CreateRuleControllerParameters, CreateRuleRequest>>(CONTROLLERS.CREATE_RULE);
    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(createRule);
