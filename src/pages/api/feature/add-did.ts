
import { SessionUser } from "@/lib/core/entity/auth-models";

import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { AddDIDControllerParameters } from "@/lib/infrastructure/controller/add-did-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import { AddDIDRequest } from "@/lib/core/usecase-models/add-did-usecase-models";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";
import {z} from "zod";

const schema = z.object({
    scope: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(['Dataset', 'Container']),
});

async function addDID(req:NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser){

    if(req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

    const params = schema.safeParse(req.body);
    if (!params.success) {
        // TODO: more detailed response
        res.status(400).json({ error: 'Missing required parameters or provided parameters are invalid' });
        return;
    }

    const controllerParameters: AddDIDControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        ...params.data
    }

    const controller = appContainer.get<BaseController<AddDIDControllerParameters, AddDIDRequest>>(CONTROLLERS.ADD_DID)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(addDID)