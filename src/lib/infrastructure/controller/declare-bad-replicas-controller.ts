import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { DeclareBadReplicasRequest } from '@/lib/core/usecase-models/declare-bad-replicas-usecase-models';
import { DeclareBadReplicasInputPort } from '@/lib/core/port/primary/declare-bad-replicas-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type DeclareBadReplicasControllerParameters = TAuthenticatedControllerParameters & {
    dids: Array<{ scope: string; name: string }>;
    rse: string;
    reason: string;
    expiresAt?: string | null;
};

@injectable()
class DeclareBadReplicasController extends BaseController<
    DeclareBadReplicasControllerParameters,
    AuthenticatedRequestModel<DeclareBadReplicasRequest>
> {
    constructor(
        @inject(USECASE_FACTORY.DECLARE_BAD_REPLICAS)
        declareBadReplicasUseCaseFactory: (response: Signal) => DeclareBadReplicasInputPort,
    ) {
        super(declareBadReplicasUseCaseFactory);
    }

    prepareRequestModel(parameters: DeclareBadReplicasControllerParameters): AuthenticatedRequestModel<DeclareBadReplicasRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            dids: parameters.dids,
            rse: parameters.rse,
            reason: parameters.reason,
            expiresAt: parameters.expiresAt,
        } as AuthenticatedRequestModel<DeclareBadReplicasRequest>;
    }
}

export default DeclareBadReplicasController;
