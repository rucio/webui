import appContainer from "@/lib/infrastructure/ioc/container-config";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";
import {DIDMetaControllerParameters} from "@/lib/infrastructure/controller/did-meta-controller";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";


async function getDIDMeta(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if(req.method === 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }
    const { scope, name } = req.query

    if(!scope || typeof scope !== 'string') {
        res.status(400).json({ error: 'Missing scope parameter' })
        return
    }
    
    if(!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Missing name parameter' })
        return
    }

    const controller = appContainer.get<BaseController<DIDMetaControllerParameters, void>>(CONTROLLERS.DID_META)
    const controllerParameters: DIDMetaControllerParameters = {
        response: res,
        scope: scope,
        name: name,
        rucioAuthToken: rucioAuthToken
    }

    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(getDIDMeta)