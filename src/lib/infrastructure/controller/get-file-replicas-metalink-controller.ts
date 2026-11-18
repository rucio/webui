import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { GetFileReplicasMetalinkRequest } from '@/lib/core/usecase-models/get-file-replicas-metalink-usecase-models';
import { GetFileReplicasMetalinkInputPort } from '@/lib/core/port/primary/get-file-replicas-metalink-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type GetFileReplicasMetalinkControllerParameters = TAuthenticatedControllerParameters & {
    scope: string;
    name: string;
    schemes?: string[];
    domain?: 'wan' | 'lan' | 'all';
    rseExpression?: string;
    allStates?: boolean;
    clientIp?: string;
};

@injectable()
class GetFileReplicasMetalinkController extends BaseController<
    GetFileReplicasMetalinkControllerParameters,
    AuthenticatedRequestModel<GetFileReplicasMetalinkRequest>
> {
    constructor(
        @inject(USECASE_FACTORY.GET_FILE_REPLICAS_METALINK)
        getFileReplicasMetalinkUseCaseFactory: (response: Signal) => GetFileReplicasMetalinkInputPort,
    ) {
        super(getFileReplicasMetalinkUseCaseFactory);
    }

    prepareRequestModel(parameters: GetFileReplicasMetalinkControllerParameters): AuthenticatedRequestModel<GetFileReplicasMetalinkRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            scope: parameters.scope,
            name: parameters.name,
            schemes: parameters.schemes,
            domain: parameters.domain,
            rseExpression: parameters.rseExpression,
            allStates: parameters.allStates,
            clientIp: parameters.clientIp,
        };
    }
}

export default GetFileReplicasMetalinkController;
