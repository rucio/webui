import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { ListDIDContentsControllerParameters } from '@/lib/infrastructure/controller/list-did-contents-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function listDIDContents(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { scope, name } = req.query as { scope: string; name: string };

    if (!scope) {
        res.status(400).json({ error: 'Missing scope parameter' });
        return;
    }
    if (!name) {
        res.status(400).json({ error: 'Missing name parameter' });
        return;
    }

    const controllerParameters: ListDIDContentsControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        scope: scope,
        name: name,
    };

    const controller = appContainer.get<BaseController<ListDIDContentsControllerParameters, void>>(CONTROLLERS.LIST_DID_CONTENTS);
    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(listDIDContents);
