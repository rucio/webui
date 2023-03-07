import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Recieves the rucio account and rucio auth token
 * in the request body. Sets the current session user
 */
async function x509Route(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const rucioAuthToken = req.body.rucioAuthToken
        const rucioAccount = req.body.rucioAccount
        const session = req.session
        if (session) {
            session.user = {
                isLoggedIn: true,
                rucioAuthToken: rucioAuthToken,
                rucioIdentity: '',
                rucioAuthType: 'x509',
                rucioAccount: rucioAccount,
                rucioOIDCProvider: '',
            }
            session.save()
            res.status(200)
        }
        else {
            res.status(500).json({ error: 'Session not intitialized' })
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' })
    }
}

export default withSessionRoute(x509Route)