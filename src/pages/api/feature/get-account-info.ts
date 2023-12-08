
import { SessionUser } from "@/lib/core/entity/auth-models";
import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { GetAccountInfoControllerParameters } from "@/lib/infrastructure/controller/get-account-info-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import { BaseController } from "@/lib/sdk/controller";
import { NextApiRequest, NextApiResponse } from "next";


async function getAccountInfo(req:NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser){

    if(req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

    // TODO validate query parameters or body
    if(!sessionUser) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    const account = sessionUser.rucioAccount
    
    const controllerParameters: GetAccountInfoControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        account: account
    }

    const controller = appContainer.get<BaseController<GetAccountInfoControllerParameters, void>>(CONTROLLERS.GET_ACCOUNT_INFO)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(getAccountInfo)