import { SessionUser } from "@/lib/core/entity/auth-models";
import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import GetSubscriptionController, { GetSubscriptionControllerParameters } from "@/lib/infrastructure/controller/get-subscription-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { NextApiRequest, NextApiResponse } from "next";

async function getSubscription(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser) {
    if(req.method === 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }
    const { account, name } = req.query
    if(!account || typeof account !== 'string') {
        res.status(400).json({ error: 'Missing account parameter' })
        return
    }
    if(!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Missing name parameter' })
        return
    }

    if(!sessionUser) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    if(!sessionUser.rucioAccount) {
        res.status(401).json({ error: 'Unauthorized: Rucio Account is not set' })
        return
    }
    
    const controller: GetSubscriptionController = appContainer.get(CONTROLLERS.GET_SUBSCRIPTION)
    const controllerParameters: GetSubscriptionControllerParameters = {
        response: res,
        account: account,
        name: name,
        sessionAccount: sessionUser?.rucioAccount,
        rucioAuthToken: rucioAuthToken
    }

    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(getSubscription)