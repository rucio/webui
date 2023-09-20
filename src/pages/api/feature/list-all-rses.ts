
import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { ListAllRSEsControllerParameters } from "@/lib/infrastructure/controller/list-all-rses-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";


async function listAllRSEs(req:NextApiRequest, res: NextApiResponse, rucioAuthToken: string){

    if(req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

    const controllerParameters: ListAllRSEsControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
    }

    const controller = appContainer.get<BaseController<ListAllRSEsControllerParameters, void>>(CONTROLLERS.LIST_ALL_RSES)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(listAllRSEs)