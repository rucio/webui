import { DIDType } from '@/lib/core/entity/rucio';
import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';
import { RSEAccountUsageLimitViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Data structure that represents the HTTP request body to invoke the CreateRule Feature
 * on the NextJS server.
 */
export type TCreateRuleFeatureRequestParams = {
    RSEViewModels: Array<RSEAccountUsageLimitViewModel>;
    DIDViewModels: Array<ListDIDsViewModel>;
    expirydate: Date;
    lifetime: number;
    notifications: boolean;
    asynchronousMode: boolean;
    numcopies: number;
    numsamples: number;
    groupby: DIDType;
    comment: string;
    approval: boolean;
};

async function endpoint(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const data = req.body;

    if (!data) {
        res.status(400).json({ error: 'Missing body' });
        return;
    }

    res.status(200).json(req.body);
}

export default withAuthenticatedSessionRoute(endpoint);
