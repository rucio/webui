import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import container, {ITestController} from '@/lib/infrastructure/config/ioc/test-container';

const logoutRoute = (req: NextApiRequest, res: NextApiResponse) => {
    const controller = container.get<ITestController>("ITestController");
    controller.handle(res);
}

export default withSessionRoute(logoutRoute);