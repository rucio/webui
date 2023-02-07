import "reflect-metadata"
import { NextApiRequest, NextApiResponse } from "next"
import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils"
import createContainer from "@/lib/infrastructure/config/ioc/container-config"
import INPUT_PORT from "@/lib/common/ioc/ioc-symbols-input-port"
import UserPassLoginController from "@/lib/infrastructure/controller/userpass-login-controller"

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body
    const account = 'ddmlab'
    const redirectTo = '/dashboard'
    const container = createContainer()
    const userpassLoginController = container.get<UserPassLoginController>(INPUT_PORT.USERPASS_LOGIN)
    
    userpassLoginController.handle(username, password, account, res, redirectTo)
    // const user = await getUser(username, password)
    // const user: RucioUser = { 
    //     rucioIdentity: username, 
    //     rucioAccount: '', 
    //     rucioAuthType: 'userpass',
    //     isLoggedIn: true,
    //     rucioAuthToken: '1234567890',
    //     rucioOIDCProvider: '' 
    // }
    // if (user) {
    //     // Any object returned will be saved in `user` property of the JWT
    //     req.session.user = user
    //     await req.session.save()
    //     res.status(200).json(user)
    // } else {
    //     res.status(401).json({ error: 'Invalid username or password' })
    // }
}

export default withSessionRoute(loginRoute)