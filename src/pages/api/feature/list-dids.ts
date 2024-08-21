import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';
import { ListDIDsControllerParameters } from '@/lib/infrastructure/controller/list-dids-controller';
import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';

async function listDIDs(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    const { query, type } = req.query;
    if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Missing query parameter' });
        return;
    }
    if (!type || typeof type !== 'string') {
        res.status(400).json({ error: 'Missing type parameter' });
        return;
    }

    const controller = appContainer.get<BaseController<ListDIDsControllerParameters, void>>(CONTROLLERS.LIST_DIDS);
    const controllerParameters: ListDIDsControllerParameters = {
        response: res,
        query: query,
        type: type,
        rucioAuthToken: rucioAuthToken,
    };

    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(listDIDs);
