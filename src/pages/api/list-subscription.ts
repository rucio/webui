import { SessionUser } from "@/lib/core/entity/auth-models";
import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { ListSubscriptionsControllerParameters } from "@/lib/infrastructure/controller/list-subscriptions-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";

async function listSubscriptions(req:NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser){
    if(req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

    const { account } = req.query as { account: string }

    if(!account) {
        res.status(400).json({ error: 'Missing account parameter' })
        return
    }

    if(!sessionUser) {
        res.status(400).json({ error: 'Invalid Session' })
        return
    }

    const sessionAccount: string = sessionUser?.rucioAccount

    if(!sessionAccount) {
        res.status(400).json({ error: 'Invalid Session. No Rucio Account found' })
        return
    }

    const controllerParameters: ListSubscriptionsControllerParameters = {
        response: res,
        account: account,
        sessionAccount: sessionAccount,
        rucioAuthToken: rucioAuthToken
    }

    const controller = appContainer.get<BaseController<ListSubscriptionsControllerParameters, void>>(CONTROLLERS.LIST_SUBSCRIPTIONS)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(listSubscriptions)