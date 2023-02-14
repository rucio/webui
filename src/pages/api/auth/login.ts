import "reflect-metadata"
import { NextApiRequest, NextApiResponse } from "next"
import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils"
import { SessionUser } from "@/lib/core/entity/auth-models"

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const user: SessionUser = {
        rucioIdentity: 'test',
        rucioAccount: 'test',
        rucioAuthToken: 'test',
        rucioAuthType: 'userpass',
        
    }
    res.redirect(307,'/')
}

export default withSessionRoute(loginRoute)