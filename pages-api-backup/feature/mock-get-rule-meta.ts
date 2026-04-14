import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { fixtureRuleMetaViewModel, generateSequenceArray } from 'test/fixtures/table-fixtures';

async function endpoint(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    res.status(200).json(fixtureRuleMetaViewModel());
}

export default withAuthenticatedSessionRoute(endpoint);
