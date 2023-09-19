
import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { GetRSEProtocolsControllerParameters } from "@/lib/infrastructure/controller/get-rse-protocols-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";


async function getRSEProtocols(req:NextApiRequest, res: NextApiResponse, rucioAuthToken: string){

    if(req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

    const { rseName } = req.query as { rseName: string }

    if(!rseName) {
        res.status(400).json({ error: 'Missing rseName parameter' })
        return
    }

    const controllerParameters: GetRSEProtocolsControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        rseName: rseName
    }

    const controller = appContainer.get<BaseController<GetRSEProtocolsControllerParameters, void>>(CONTROLLERS.GET_RSE_PROTOCOLS)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(getRSEProtocols)