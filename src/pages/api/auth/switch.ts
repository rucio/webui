import { addOrUpdateSessionUser, withSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { IronSession } from 'iron-session';
import { NextApiRequest, NextApiResponse } from 'next';

async function switchUsers(req: NextApiRequest, res: NextApiResponse) {
    const session: IronSession = req.session;
    const { account, callbackUrl } = req.query;

    if (account === undefined) {
        res.status(400).json({ message: 'Account is not specified' });
        return;
    }

    if (session.allUsers === undefined) {
        res.status(400).json({ message: 'No authentications found' });
        return;
    }

    const userIdx = session.allUsers?.findIndex(sessionUser => sessionUser.rucioAccount === account);

    if (userIdx === -1) {
        res.status(400).json({ message: 'No authentication found for the specified account' });
        return;
    }

    const user = session.allUsers?.at(userIdx!);
    await addOrUpdateSessionUser(session, user!, true);
    res.redirect((callbackUrl as string) ?? '/');
}

export default withSessionRoute(switchUsers);
