import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { NextApiRequest, NextApiResponse } from "next";
import { fixtureRuleViewModel, fixtureSubscriptionRuleStatesViewModel, fixtureSubscriptionViewModel, generateSequenceArray } from "test/fixtures/table-fixtures";
import { Readable } from "stream";

async function endpoint(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if(req.method !== 'PUT') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

    const { subscriptionID } = req.query
    if(!subscriptionID) {
        res.status(400).json({ error: 'Missing subscriptionID' })
        return
    }

    if(!req.body) {
        // currently accepts any body
        res.status(400).json({ error: 'Missing body' })
        return
    }

    res.status(200).json(
        // currently only responds with a fake subscription
        // in reality, return the updated subscription.
        fixtureSubscriptionViewModel()
    )
}

export default withAuthenticatedSessionRoute(endpoint); 