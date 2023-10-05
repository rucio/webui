
import { SessionUser } from "@/lib/core/entity/auth-models";

import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { ListSubscriptionRuleStatesControllerParameters } from "@/lib/infrastructure/controller/list-subscription-rule-states-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";


async function listSubscriptionRuleStates(req:NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser){

    if(req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }
   
    const account = sessionUser?.rucioAccount
    if(!account) {
        res.status(400).json({ error: 'Could not determine account name. Are you logged in?' })
        return
    }

    const controllerParameters: ListSubscriptionRuleStatesControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        account: account,
    }

    const controller = appContainer.get<BaseController<ListSubscriptionRuleStatesControllerParameters, void>>(CONTROLLERS.LIST_SUBSCRIPTION_RULE_STATES)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(listSubscriptionRuleStates)