
import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { GetRSEAttributesControllerParameters } from "@/lib/infrastructure/controller/get-rse-attributes-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";


async function getRSEAttributes(req:NextApiRequest, res: NextApiResponse, rucioAuthToken: string){

    if(req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

    const { rseName } = req.query as { rseName: string }

    if(!rseName) {
        res.status(400).json({ error: 'Missing rseName parameter' })
        return
    }

    const controllerParameters: GetRSEAttributesControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        rseName: rseName
    }

    const controller = appContainer.get<BaseController<GetRSEAttributesControllerParameters, void>>(CONTROLLERS.GET_RSE_ATTRIBUTES)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(getRSEAttributes)