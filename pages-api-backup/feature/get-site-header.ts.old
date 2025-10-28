import { withSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import GetSiteHeaderController, { GetSiteHeaderControllerParameters } from '@/lib/infrastructure/controller/get-site-header-controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function getSiteHeader(req: NextApiRequest, res: NextApiResponse) {
    const siteHeaderController: GetSiteHeaderController = appContainer.get(CONTROLLERS.GET_SITE_HEADER);
    const controllerParameters: GetSiteHeaderControllerParameters = {
        session: req.session,
        response: res,
    };
    await siteHeaderController.execute(controllerParameters);
}

export default withSessionRoute(getSiteHeader);
