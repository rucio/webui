import "reflect-metadata"
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import container from '@/lib/infrastructure/config/ioc/test-container';
import { ITestController } from "@/lib/infrastructure/controller/test-usecase-controller";
import CONTROLLERS from "@/lib/infrastructure/config/ioc/ioc-symbols-controllers";

const logoutRoute = (req: NextApiRequest, res: NextApiResponse) => {
    const controller = container.get<ITestController>(CONTROLLERS.TEST);
    controller.handle(res);
}


export default withSessionRoute(logoutRoute);