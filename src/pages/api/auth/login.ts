import "reflect-metadata"
import { NextApiRequest, NextApiResponse } from "next"
import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils"
import appContainer from "@/lib/infrastructure/config/ioc/container-config"
import { IUserPassLoginController } from "@/lib/infrastructure/controller/userpass-login-controller"
import CONTROLLERS from "@/lib/infrastructure/config/ioc/ioc-symbols-controllers"

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body
    const account = 'ddmlab'
    const redirectTo = '/dashboard'
    const userpassLoginController = appContainer.get<IUserPassLoginController>(CONTROLLERS.USERPASS_LOGIN)
    userpassLoginController.handle(username, password, account, res, redirectTo)
}

export default withSessionRoute(loginRoute)