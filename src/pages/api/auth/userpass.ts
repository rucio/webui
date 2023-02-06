import { NextApiRequest, NextApiResponse } from "next"
import { RucioUser } from "@/lib/core/entity/auth-models"
import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils"

async function userpassRoute(req: NextApiRequest, res: NextApiResponse) {
    const { username, password, account } = req.body
    const { redirectTo } = req.query
    
    // const user = await getUser(username, password)
    const user: RucioUser = { 
        rucioIdentity: username, 
        rucioAccount: '', 
        rucioAuthType: 'userpass',
        isLoggedIn: true,
        rucioAuthToken: '1234567890',
        rucioOIDCProvider: '' 
    }
    if (user) {
        // Any object returned will be saved in `user` property of the JWT
        req.session.user = user
        await req.session.save()
        res.status(200).json(user)
    } else {
        res.status(401).json({ error: 'Invalid username or password' })
    }
}

export default withSessionRoute(userpassRoute)