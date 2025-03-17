import { SessionUser } from '@/lib/core/entity/auth-models';

import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { ListExtendedDIDsControllerParameters } from '@/lib/infrastructure/controller/list-extended-dids-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { ListExtendedDIDsRequest } from '@/lib/core/usecase-models/list-extended-dids-usecase-models';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function listExtendedDIDs(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser) {
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

    const controllerParameters: ListExtendedDIDsControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        query: query,
        type: type,
    };

    const controller = appContainer.get<BaseController<ListExtendedDIDsControllerParameters, ListExtendedDIDsRequest>>(
        CONTROLLERS.LIST_EXTENDED_DIDS,
    );
    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(listExtendedDIDs);
