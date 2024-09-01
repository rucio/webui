import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { fixtureRulePageLockEntryViewModel, generateSequenceArray } from 'test/fixtures/table-fixtures';
import { Readable } from 'stream';

async function endpoint(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Encoding', 'none');

    const data = generateSequenceArray(10, fixtureRulePageLockEntryViewModel);

    const stream = Readable.from(data.map(entry => JSON.stringify(entry) + '\n'));
    stream.pipe(res);
}

export default withAuthenticatedSessionRoute(endpoint);
