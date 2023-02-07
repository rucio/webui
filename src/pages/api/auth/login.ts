import "reflect-metadata"
import { NextApiRequest, NextApiResponse } from "next"
import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils"
import appContainer from "@/lib/infrastructure/config/ioc/container-config"
import INPUT_PORT from "@/lib/common/ioc/ioc-symbols-input-port"
import UserPassLoginController from "@/lib/infrastructure/controller/userpass-login-controller"

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body
    const account = 'ddmlab'
    const redirectTo = '/dashboard'
    const userpassLoginController = appContainer.get<UserPassLoginController>(INPUT_PORT.USERPASS_LOGIN)
    userpassLoginController.handle(username, password, account, res, redirectTo)
}

export default withSessionRoute(loginRoute)