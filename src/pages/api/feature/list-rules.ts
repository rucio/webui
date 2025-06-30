import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { ListRulesControllerParameters } from '@/lib/infrastructure/controller/list-rules-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { ListRulesRequest } from '@/lib/core/usecase-models/list-rules-usecase-models';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';
import { SessionUser } from '@/lib/core/entity/auth-models';

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

    // TODO: check if created_after is an actual date
    const {
        scope,
        created_after,
        account: customAccount,
        activity,
    } = req.query as {
        scope?: string;
        created_after?: string;
        account?: string;
        activity?: string;
    };

    const controllerParameters: ListRulesControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        account: customAccount ?? currentAccount,
        activity: activity,
        scope: scope,
        created_after: created_after,
    };

    const controller = appContainer.get<BaseController<ListRulesControllerParameters, ListRulesRequest>>(CONTROLLERS.LIST_RULES);
    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(listRules);
