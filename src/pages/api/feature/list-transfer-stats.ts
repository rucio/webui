import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { ListTransferStatsControllerParameters } from "@/lib/infrastructure/controller/list-transfer-stats-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";

async function listTransferStats(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {

    if(req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

    const controllerParameters: ListTransferStatsControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
    }

    const controller = appContainer.get<BaseController<ListTransferStatsControllerParameters, void>>(CONTROLLERS.LIST_TRANSFER_STATS)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(listTransferStats)