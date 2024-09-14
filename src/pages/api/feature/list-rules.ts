
import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { ListRulesControllerParameters } from "@/lib/infrastructure/controller/list-rules-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import { ListRulesRequest } from "@/lib/core/usecase-models/list-rules-usecase-models";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";
import {SessionUser} from "@/lib/core/entity/auth-models";


async function listRules(req:NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser){
    if(req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

    if (!sessionUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const account = sessionUser.rucioAccount;

    const { scope } = req.query as { scope?: string }

    const controllerParameters: ListRulesControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        account: account,
        scope: scope,
    }

    const controller = appContainer.get<BaseController<ListRulesControllerParameters, ListRulesRequest>>(CONTROLLERS.LIST_RULES)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(listRules)