import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { ISiteHeaderController } from "@/lib/infrastructure/controller/site-header-controller";
import { NextApiRequest, NextApiResponse } from "next";

async function siteHeader(req: NextApiRequest, res: NextApiResponse) {
    const siteHeaderController: ISiteHeaderController = appContainer.get(CONTROLLERS.SITE_HEADER)
    await siteHeaderController.handle(req.session, res)
}

export default withSessionRoute(siteHeader)