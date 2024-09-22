import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { GetRSEUsageControllerParameters } from '@/lib/infrastructure/controller/get-rse-usage-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { GetRSEUsageRequest } from '@/lib/core/usecase-models/get-rse-usage-usecase-models';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function getRSEUsage(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { rseName } = req.query as { rseName: string };

    if (!rseName) {
        res.status(400).json({ error: 'Missing rseName parameter' });
        return;
    }

    const controllerParameters: GetRSEUsageControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        rseName: rseName,
    };

    const controller = appContainer.get<BaseController<GetRSEUsageControllerParameters, GetRSEUsageRequest>>(CONTROLLERS.GET_RSE_USAGE);
    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(getRSEUsage);
