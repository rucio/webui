import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListFileReplicasRequest } from '@/lib/core/usecase-models/list-file-replicas-usecase-models';
import { ListFileReplicasInputPort } from '@/lib/core/port/primary/list-file-replicas-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type ListFileReplicasControllerParameters = TAuthenticatedControllerParameters & {
    rucioAuthToken: string;
    scope: string;
    name: string;
};

@injectable()
class ListFileReplicasController extends BaseController<ListFileReplicasControllerParameters, AuthenticatedRequestModel<ListFileReplicasRequest>> {
    constructor(
        @inject(USECASE_FACTORY.LIST_FILE_REPLICAS) listFileReplicasUseCaseFactory: (response: NextApiResponse) => ListFileReplicasInputPort,
    ) {
        super(listFileReplicasUseCaseFactory);
    }
    prepareRequestModel(parameters: ListFileReplicasControllerParameters): AuthenticatedRequestModel<ListFileReplicasRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            scope: parameters.scope,
            name: parameters.name,
        };
    }
}

export default ListFileReplicasController;
