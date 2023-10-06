import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { NextApiRequest, NextApiResponse } from "next";
import { fixtureRuleMetaViewModel } from "test/fixtures/table-fixtures";

async function endpoint(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if(req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

    const { ruleId } = req.query
    if(!ruleId) {
        res.status(400).json({ error: 'Missing ruleId' })
        return
    }
    const { updatedRule } = req.body
    
    if(!updatedRule) {
        res.status(400).json({ error: 'Missing body' })
        return
    }
    
    res.status(200).json({
        ...fixtureRuleMetaViewModel(),
        updatedRule
    })
}

export default withAuthenticatedSessionRoute(endpoint);