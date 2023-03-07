import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import appContainer from "@/lib/infrastructure/config/ioc/container-config";
import CONTROLLERS from "@/lib/infrastructure/config/ioc/ioc-symbols-controllers";
import { ISetX509LoginSessionController } from "@/lib/infrastructure/controller/set-x509-login-session-controller";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Recieves the rucio account and rucio auth token
 * in the request body. Sets the current session user
 */
async function x509Route(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { rucioAccount, rucioAuthToken, rucioTokenExpiry, shortVOName } = req.body
        const setX509LoginSessionController = appContainer.get<ISetX509LoginSessionController>(CONTROLLERS.SET_X509_LOGIN_SESSION)
        await setX509LoginSessionController.handle(
            req.session,
            res,
            rucioAuthToken,
            rucioAccount,
            shortVOName,
            rucioTokenExpiry
        )
    } else {
        res.status(405).json({ message: 'Method not allowed' })
    }
}

export default withSessionRoute(x509Route)