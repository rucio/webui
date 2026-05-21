import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListSuspiciousReplicasRequest } from '@/lib/core/usecase-models/list-suspicious-replicas-usecase-models';
import { ListSuspiciousReplicasInputPort } from '@/lib/core/port/primary/list-suspicious-replicas-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type ListSuspiciousReplicasControllerParameters = TAuthenticatedControllerParameters & {
    rucioAuthToken: string;
    rseExpression?: string;
    youngerThan?: string;
    nattempts?: number;
};

@injectable()
class ListSuspiciousReplicasController extends BaseController<
    ListSuspiciousReplicasControllerParameters,
    AuthenticatedRequestModel<ListSuspiciousReplicasRequest>
> {
    constructor(
        @inject(USECASE_FACTORY.LIST_SUSPICIOUS_REPLICAS)
        listSuspiciousReplicasUseCaseFactory: (response: Signal) => ListSuspiciousReplicasInputPort,
    ) {
        super(listSuspiciousReplicasUseCaseFactory);
    }

    prepareRequestModel(
        parameters: ListSuspiciousReplicasControllerParameters,
    ): AuthenticatedRequestModel<ListSuspiciousReplicasRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            rseExpression: parameters.rseExpression,
            youngerThan: parameters.youngerThan,
            nattempts: parameters.nattempts,
        } as AuthenticatedRequestModel<ListSuspiciousReplicasRequest>;
    }
}

export default ListSuspiciousReplicasController;
