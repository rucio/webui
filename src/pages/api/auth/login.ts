import "reflect-metadata"
import { NextApiRequest, NextApiResponse } from "next"
import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils"
import { LoginViewModel } from "@/lib/infrastructure/data/view-model/login"

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
        const viewModel: LoginViewModel = {
            x509Enabled: false,
            oidcEnabled: false,
            oidcProviders: [],
            multiVOEnabled: false,
            voList: [],
            isLoggedIn: isLoggedIn
        }
        res.status(200).json(viewModel)
    }
    else {
        res.status(405).json({ error: 'Method not allowed' })
    }
}

export default withSessionRoute(loginRoute)