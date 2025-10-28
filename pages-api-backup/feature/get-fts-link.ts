import appContainer from '@/lib/infrastructure/ioc/container-config';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { GetFTSLinkControllerParameters } from '@/lib/infrastructure/controller/get-fts-link-controller';

async function getFTSLink(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    const { scope, name, rse } = req.query;

    if (!scope || typeof scope !== 'string') {
        res.status(400).json({ error: 'Missing scope parameter' });
        return;
    }

    if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Missing name parameter' });
        return;
    }

    if (!rse || typeof rse !== 'string') {
        res.status(400).json({ error: 'Missing rse parameter' });
        return;
    }

    const controller = appContainer.get<BaseController<GetFTSLinkControllerParameters, void>>(CONTROLLERS.GET_FTS_LINK);
    const controllerParameters: GetFTSLinkControllerParameters = {
        response: res,
        scope: scope,
        name: name,
        rse: rse,
        rucioAuthToken: rucioAuthToken,
    };

    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(getFTSLink);
