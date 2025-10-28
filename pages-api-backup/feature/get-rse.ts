import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { GetRSEControllerParameters } from '@/lib/infrastructure/controller/get-rse-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function getRSE(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { rseName } = req.query as { rseName: string };

    if (!rseName) {
        res.status(400).json({ error: 'Missing rse parameter' });
        return;
    }

    const controllerParameters: GetRSEControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        rseName: rseName,
    };

    const controller = appContainer.get<BaseController<GetRSEControllerParameters, void>>(CONTROLLERS.GET_RSE);
    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(getRSE);
