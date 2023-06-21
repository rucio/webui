import "reflect-metadata"
import { NextApiRequest, NextApiResponse } from "next"
import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils"
import appContainer from "@/lib/infrastructure/ioc/container-config"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import { BaseController } from "@/lib/sdk/controller"
import LoginConfigController, { LoginConfigControllerParams } from "@/lib/infrastructure/controller/login-config-controller"

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const sessionExists = req.session !== undefined
    const isLoggedIn = sessionExists && req.session.user !== undefined && req.session.user.isLoggedIn
    
    if (req.method === 'GET') {
        // If user is logged in, redirect to callbackUrl
        if (isLoggedIn) {
            const callbackUrl = req.query.callbackUrl as string | undefined
            if (callbackUrl) {
                res.redirect(callbackUrl)
            } else {
                res.redirect("/dashboard")
            }
            return
        }
        // If user is not logged in, callbackUrl = provided callbackUrl or home page, then redirect to login page
        const callbackUrl = req.query.callbackUrl as string | '/dashboard'
        res.redirect(`/auth/login?callbackUrl=${callbackUrl}`)
    }
    else if (req.method === 'POST') {
        const loginConfigController: LoginConfigController = appContainer.get<BaseController<LoginConfigControllerParams, void>>(CONTROLLERS.LOGIN_CONFIG)
        await loginConfigController.execute({
            session: req.session,
            response: res
        })
    }
    else {
        res.status(405).json({ error: 'Method not allowed' })
    }
}

export default withSessionRoute(loginRoute)