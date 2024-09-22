
import { SessionUser } from "@/lib/core/entity/auth-models";

import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { AttachDIDsControllerParameters } from "@/lib/infrastructure/controller/attach-dids-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import { AttachDIDsRequest } from "@/lib/core/usecase-models/attach-dids-usecase-models";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";
import {z} from "zod";

const schema = z.object({
    dids: z
        .array(
            z.object({
                scope: z.string().min(1),
                name: z.string().min(1),
            }),
        )
        .nonempty(),
    scope: z.string().min(1),
    name: z.string().min(1)
});

async function attachDIDs(req:NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser){

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

    const controllerParameters: AttachDIDsControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        ...params.data,
    }

    const controller = appContainer.get<BaseController<AttachDIDsControllerParameters, AttachDIDsRequest>>(CONTROLLERS.ATTACH_DIDS)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(attachDIDs)