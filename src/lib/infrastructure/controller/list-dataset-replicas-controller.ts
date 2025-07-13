import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListDatasetReplicasRequest } from '@/lib/core/usecase-models/list-dataset-replicas-usecase-models';
import { ListDatasetReplicasInputPort } from '@/lib/core/port/primary/list-dataset-replicas-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type ListDatasetReplicasControllerParameters = TAuthenticatedControllerParameters & {
    rucioAuthToken: string;
    scope: string;
    name: string;
};

@injectable()
class ListDatasetReplicasController extends BaseController<
    ListDatasetReplicasControllerParameters,
    AuthenticatedRequestModel<ListDatasetReplicasRequest>
> {
    constructor(
        @inject(USECASE_FACTORY.LIST_DATASET_REPLICAS) listDatasetReplicasUseCaseFactory: (response: Signal) => ListDatasetReplicasInputPort,
    ) {
        super(listDatasetReplicasUseCaseFactory);
    }
    prepareRequestModel(parameters: ListDatasetReplicasControllerParameters): AuthenticatedRequestModel<ListDatasetReplicasRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            scope: parameters.scope,
            name: parameters.name,
        } as AuthenticatedRequestModel<ListDatasetReplicasRequest>;
    }
}

export default ListDatasetReplicasController;
