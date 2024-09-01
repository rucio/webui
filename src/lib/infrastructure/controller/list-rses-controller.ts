import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListRSEsRequest } from '@/lib/core/usecase-models/list-rses-usecase-models';
import { ListRSEsInputPort } from '@/lib/core/port/primary/list-rses-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type ListRSEsControllerParameters = TAuthenticatedControllerParameters & {
    rseExpression: string;
};

@injectable()
class ListRSEsController extends BaseController<ListRSEsControllerParameters, AuthenticatedRequestModel<ListRSEsRequest>> {
    constructor(@inject(USECASE_FACTORY.LIST_RSES) listRSEsUseCaseFactory: (response: NextApiResponse) => ListRSEsInputPort) {
        super(listRSEsUseCaseFactory);
    }
    prepareRequestModel(parameters: ListRSEsControllerParameters): AuthenticatedRequestModel<ListRSEsRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            rseExpression: parameters.rseExpression,
        };
    }
}

export default ListRSEsController;
