
import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { ListRSEsControllerParameters } from "@/lib/infrastructure/controller/list-rses-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";


async function listRSEs(req:NextApiRequest, res: NextApiResponse, rucioAuthToken: string){

    if(req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

    let { rseExpression } = req.query as { rseExpression: string }

    if(!rseExpression) {
        rseExpression = ''
    }

    const controllerParameters: ListRSEsControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        rseExpression: rseExpression
    }

    const controller = appContainer.get<BaseController<ListRSEsControllerParameters, void>>(CONTROLLERS.LIST_RSES)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(listRSEs)