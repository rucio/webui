import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListExtendedDIDsRequest } from '@/lib/core/usecase-models/list-extended-dids-usecase-models';
import { ListExtendedDIDsInputPort } from '@/lib/core/port/primary/list-extended-dids-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { parseDIDType } from '@/lib/common/did-utils';

export type ListExtendedDIDsControllerParameters = TAuthenticatedControllerParameters & {
    query: string;
    type: string;
};

@injectable()
class ListExtendedDIDsController extends BaseController<ListExtendedDIDsControllerParameters, AuthenticatedRequestModel<ListExtendedDIDsRequest>> {
    constructor(
        @inject(USECASE_FACTORY.LIST_EXTENDED_DIDS) listExtendedDIDsUseCaseFactory: (response: NextApiResponse) => ListExtendedDIDsInputPort,
    ) {
        super(listExtendedDIDsUseCaseFactory);
    }
    prepareRequestModel(parameters: ListExtendedDIDsControllerParameters): AuthenticatedRequestModel<ListExtendedDIDsRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            query: parameters.query,
            type: parseDIDType(parameters.type),
        };
    }
}

export default ListExtendedDIDsController;
