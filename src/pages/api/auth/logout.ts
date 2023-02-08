import "reflect-metadata"
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/infrastructure/auth/session-utils';

const logoutRoute = (req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy();
    res.status(200).json({ message: 'Logged out' });
}


export default withSessionRoute(logoutRoute);