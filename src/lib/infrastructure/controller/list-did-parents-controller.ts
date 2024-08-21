import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListDIDParentsRequest } from '@/lib/core/usecase-models/list-did-parents-usecase-models';
import { ListDIDParentsInputPort } from '@/lib/core/port/primary/list-did-parents-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type ListDIDParentsControllerParameters = TAuthenticatedControllerParameters & {
    rucioAuthToken: string;
    scope: string;
    name: string;
};

@injectable()
class ListDIDParentsController extends BaseController<ListDIDParentsControllerParameters, AuthenticatedRequestModel<ListDIDParentsRequest>> {
    constructor(@inject(USECASE_FACTORY.LIST_DID_PARENTS) listDIDParentsUseCaseFactory: (response: NextApiResponse) => ListDIDParentsInputPort) {
        super(listDIDParentsUseCaseFactory);
    }
    prepareRequestModel(parameters: ListDIDParentsControllerParameters): AuthenticatedRequestModel<ListDIDParentsRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            scope: parameters.scope,
            name: parameters.name,
        };
    }
}

export default ListDIDParentsController;
