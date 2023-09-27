import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { IGetSiteHeaderController } from "@/lib/infrastructure/controller/get-site-header-controller";
import { NextApiRequest, NextApiResponse } from "next";

async function getSiteHeader(req: NextApiRequest, res: NextApiResponse) {
    const siteHeaderController: IGetSiteHeaderController = appContainer.get(CONTROLLERS.SITE_HEADER)
    await siteHeaderController.handle(req.session, res)
}

export default withSessionRoute(getSiteHeader)