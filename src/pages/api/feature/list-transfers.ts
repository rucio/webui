import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { ListTransfersControllerParameters } from "@/lib/infrastructure/controller/list-transfers-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";

async function listTransfers(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

    let { sourceRSE, destRSE } = req.query as { sourceRSE: string, destRSE: string }

    if (!sourceRSE) {
        res.status(400).json({ error: 'Missing sourceRSE' })
        return
    }

    if (!destRSE) {
        res.status(400).json({ error: 'Missing destRSE' })
        return
    }

    const controllerParameters: ListTransfersControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        sourceRSE: sourceRSE,
        destRSE: destRSE
    }

    const controller = appContainer.get<BaseController<ListTransfersControllerParameters, void>>(CONTROLLERS.LIST_TRANSFERS)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(listTransfers)