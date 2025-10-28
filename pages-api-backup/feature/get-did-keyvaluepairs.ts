import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { DIDKeyValuePairsDataControllerParameters } from '@/lib/infrastructure/controller/did-keyvaluepairs-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function getDIDKeyValuePairs(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if (req.method === 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    const { scope, name } = req.query;

    if (!scope || typeof scope !== 'string') {
        res.status(400).json({ error: 'Missing scope parameter' });
        return;
    }

    if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Missing name parameter' });
        return;
    }

    const controller = appContainer.get<BaseController<DIDKeyValuePairsDataControllerParameters, void>>(CONTROLLERS.DID_KEYVALUEPAIRS);
    const controllerParameters: DIDKeyValuePairsDataControllerParameters = {
        response: res,
        scope: scope,
        name: name,
        rucioAuthToken: rucioAuthToken,
    };

    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(getDIDKeyValuePairs);
