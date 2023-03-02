import "reflect-metadata"
import { NextApiRequest, NextApiResponse } from "next"
import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils"
import appContainer from "@/lib/infrastructure/config/ioc/container-config"
import { IUserPassLoginController } from "@/lib/infrastructure/controller/userpass-login-controller"
import CONTROLLERS from "@/lib/infrastructure/config/ioc/ioc-symbols-controllers"

async function userpassAuthRoute(req: NextApiRequest, res: NextApiResponse) {
    const { username, password, account } = req.body
    const redirectTo = '/dashboard'
    const userpassLoginController = appContainer.get<IUserPassLoginController>(CONTROLLERS.USERPASS_LOGIN)
    userpassLoginController.handle(username, password, account, req.session, res, redirectTo)
}

export default withSessionRoute(userpassAuthRoute)