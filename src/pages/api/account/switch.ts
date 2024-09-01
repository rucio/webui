import { withSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import SwitchAccountController from '@/lib/infrastructure/controller/switch-account-controller';
import { IronSession } from 'iron-session';
import { NextApiRequest, NextApiResponse } from 'next';

async function switchAccounts(req: NextApiRequest, res: NextApiResponse) {
    const session: IronSession = req.session;
    const { rucioIdentity, rucioAccount, rucioAuthType, redirectTo } = req.body;
    const redirectUrl = redirectTo || '/dashboard';
    const switchAccountController: SwitchAccountController = appContainer.get(CONTROLLERS.SWITCH_ACCOUNT);
    switchAccountController.handle(session, res, rucioIdentity, rucioAccount, rucioAuthType, redirectUrl);
}

export default withSessionRoute(switchAccounts);
