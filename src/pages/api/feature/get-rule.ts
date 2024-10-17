import { SessionUser } from '@/lib/core/entity/auth-models';

import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { GetRuleControllerParameters } from '@/lib/infrastructure/controller/get-rule-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { GetRuleRequest } from '@/lib/core/usecase-models/get-rule-usecase-models';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function getRule(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'Rule ID should be specified' });
        return;
    }

    const controllerParameters: GetRuleControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        id,
    };

    const controller = appContainer.get<BaseController<GetRuleControllerParameters, GetRuleRequest>>(CONTROLLERS.GET_RULE);
    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(getRule);
