import { SessionUser } from '@/lib/core/entity/auth-models';
import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { ListDIDRulesControllerParameters } from '@/lib/infrastructure/controller/list-did-rules-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function listDIDRules(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    if (!sessionUser) {
        res.status(400).json({ error: 'Invalid Session' });
        return;
    }
    if (!sessionUser.rucioAccount) {
        res.status(400).json({ error: 'Invalid Session. No Rucio Account found' });
        return;
    }

    const { scope, name } = req.query as { scope: string; name: string };

    if (!scope || !name) {
        res.status(400).json({ error: 'Missing scope or name parameter' });
        return;
    }

    const controllerParameters: ListDIDRulesControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        sessionAccount: sessionUser.rucioAccount,
        scope: scope,
        name: name,
    };

    const controller = appContainer.get<BaseController<ListDIDRulesControllerParameters, void>>(CONTROLLERS.LIST_DID_RULES);
    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(listDIDRules);
