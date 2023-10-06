import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { NextApiRequest, NextApiResponse } from "next";
import { fixtureRuleMetaViewModel, generateSequenceArray } from "test/fixtures/table-fixtures";

async function endpoint(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if(req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }
    if(!req.body) {
        res.status(400).json({ error: 'Missing body' })
        return
    }
    const { dids } = req.body
    if(!dids) {
        res.status(400).json({ error: 'Missing dids' })
        return
    }
    const response = dids.map((did: string) => {
        return {
            did,
            is_valid: true,
            reason: null
        }
    })

    res.status(200).json(response)
}

export default withAuthenticatedSessionRoute(endpoint);