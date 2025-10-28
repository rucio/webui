import 'reflect-metadata';
import type { NextApiRequest, NextApiResponse } from 'next';
import { removeSessionUser, withSessionRoute } from '@/lib/infrastructure/auth/session-utils';

const logoutRoute = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = req.session;
    const host = req.url ? req.url.split('/')[0] : '';
    const { callbackUrl } = req.query;
    const redirectUrl = `${host}/auth/login?callbackUrl=${callbackUrl}`;

    if (!session) {
        res.status(200).json({ message: 'No session present to logout!' });
        return;
    }

    const user = session.user;
    if (!user) {
        res.status(200).json({ message: 'No user found!' });
        return;
    }

    if (req.method === 'GET') {
        await removeSessionUser(req.session, user);
        const message = `Logged out ${user.rucioAccount}. Currently active accounts: ${session.allUsers}`;

        if (callbackUrl) {
            res.redirect(redirectUrl as string);
            return;
        }
        res.status(200).json({ message });
        return;
    }

    if (req.method === 'POST') {
        req.session.destroy();
        const { callbackUrl } = req.query;
        if (callbackUrl) {
            res.redirect(redirectUrl as string);
            return;
        }
        res.status(200).json({ message: 'Logged out from all acounts!' });
        return;
    }
};

export default withSessionRoute(logoutRoute);
