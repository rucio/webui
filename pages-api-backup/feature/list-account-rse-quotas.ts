import { SessionUser } from '@/lib/core/entity/auth-models';
import { DIDLong } from '@/lib/core/entity/rucio';
import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { ListAccountRSEQuotasControllerParameters } from '@/lib/infrastructure/controller/list-account-rse-quotas-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function endpoint(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    if (sessionUser === undefined || sessionUser === null || sessionUser.rucioAccount === undefined || sessionUser.rucioAccount === null) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const jsonBody = JSON.parse(req.body);
    const requestedDIDs: DIDLong[] = jsonBody.requestedDIDs;
    if (requestedDIDs === undefined || requestedDIDs === null || requestedDIDs.length === 0) {
        res.status(400).json({ error: 'Bad Request. List of DIDs must be provided in request body.' });
        return;
    }

    let rseExpression: string = jsonBody.rseExpression;
    if (rseExpression === undefined || rseExpression === null || rseExpression.length === 0) {
        rseExpression = '';
    }

    const account = sessionUser.rucioAccount;

    const controllerParameters: ListAccountRSEQuotasControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        account: account,
        requestedDIDs: requestedDIDs,
        rseExpression: rseExpression,
    };

    const controller = appContainer.get<BaseController<ListAccountRSEQuotasControllerParameters, void>>(CONTROLLERS.LIST_ACCOUNT_RSE_QUOTAS);
    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(endpoint);
