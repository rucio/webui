import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListRuleReplicaLockStatesRequest } from '@/lib/core/usecase-models/list-rule-replica-lock-states-usecase-models';
import { ListRuleReplicaLockStatesInputPort } from '@/lib/core/port/primary/list-rule-replica-lock-states-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type ListRuleReplicaLockStatesControllerParameters = TAuthenticatedControllerParameters & {
    id: string;
};

@injectable()
class ListRuleReplicaLockStatesController extends BaseController<
    ListRuleReplicaLockStatesControllerParameters,
    AuthenticatedRequestModel<ListRuleReplicaLockStatesRequest>
> {
    constructor(
        @inject(USECASE_FACTORY.LIST_RULE_REPLICA_LOCK_STATES)
        listRuleReplicaLockStatesUseCaseFactory: (response: NextApiResponse) => ListRuleReplicaLockStatesInputPort,
    ) {
        super(listRuleReplicaLockStatesUseCaseFactory);
    }
    prepareRequestModel(parameters: ListRuleReplicaLockStatesControllerParameters): AuthenticatedRequestModel<ListRuleReplicaLockStatesRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            id: parameters.id,
        };
    }
}

export default ListRuleReplicaLockStatesController;
