import {withAuthenticatedSessionRoute} from "@/lib/infrastructure/auth/session-utils";
import {
    ListAccountRSEUsageControllerParameters
} from "@/lib/infrastructure/controller/list-account-rse-usage-controller";
import appContainer from "@/lib/infrastructure/ioc/container-config";
import {ListAccountRSEUsageRequest} from "@/lib/core/usecase-models/list-account-rse-usage-usecase-models";
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers";
import {BaseController} from "@/lib/sdk/controller";
import {NextApiRequest, NextApiResponse} from "next";
import {SessionUser} from "@/lib/core/entity/auth-models";


async function listAccountRSEUsage(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser) {
    if (req.method !== 'GET') {
        res.status(405).json({error: 'Method Not Allowed'})
        return
    }

    if (sessionUser === undefined || sessionUser === null || sessionUser.rucioAccount === undefined || sessionUser.rucioAccount === null) {
        res.status(401).json({error: 'Unauthorized'})
        return
    }

    const controllerParameters: ListAccountRSEUsageControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        account: sessionUser.rucioAccount
    }

    const controller = appContainer.get<BaseController<ListAccountRSEUsageControllerParameters, ListAccountRSEUsageRequest>>(CONTROLLERS.LIST_ACCOUNT_RSE_USAGE)
    await controller.execute(controllerParameters)
}

export default withAuthenticatedSessionRoute(listAccountRSEUsage)