import { SessionUser } from '@/lib/core/entity/auth-models';

import { withAuthenticatedSessionRoute } from '@/lib/infrastructure/auth/session-utils';
import { ListRuleReplicaLockStatesControllerParameters } from '@/lib/infrastructure/controller/list-rule-replica-lock-states-controller';
import appContainer from '@/lib/infrastructure/ioc/container-config';
import { ListRuleReplicaLockStatesRequest } from '@/lib/core/usecase-models/list-rule-replica-lock-states-usecase-models';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import { BaseController } from '@/lib/sdk/controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function listRuleReplicaLockStates(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string, sessionUser?: SessionUser) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'Rule ID should be specified' });
        return;
    }

    const controllerParameters: ListRuleReplicaLockStatesControllerParameters = {
        response: res,
        rucioAuthToken: rucioAuthToken,
        id,
    };

    const controller = appContainer.get<BaseController<ListRuleReplicaLockStatesControllerParameters, ListRuleReplicaLockStatesRequest>>(
        CONTROLLERS.LIST_RULE_REPLICA_LOCK_STATES,
    );
    await controller.execute(controllerParameters);
}

export default withAuthenticatedSessionRoute(listRuleReplicaLockStates);
