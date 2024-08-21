import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListDIDContentsRequest } from '@/lib/core/usecase-models/list-did-contents-usecase-models';
import { ListDIDContentsInputPort } from '@/lib/core/port/primary/list-did-contents-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type ListDIDContentsControllerParameters = TAuthenticatedControllerParameters & {
    scope: string;
    name: string;
};

@injectable()
class ListDIDContentsController extends BaseController<ListDIDContentsControllerParameters, AuthenticatedRequestModel<ListDIDContentsRequest>> {
    constructor(@inject(USECASE_FACTORY.LIST_DID_CONTENTS) listDIDContentsUseCaseFactory: (response: NextApiResponse) => ListDIDContentsInputPort) {
        super(listDIDContentsUseCaseFactory);
    }
    prepareRequestModel(parameters: ListDIDContentsControllerParameters): AuthenticatedRequestModel<ListDIDContentsRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            scope: parameters.scope,
            name: parameters.name,
        };
    }
}

export default ListDIDContentsController;
