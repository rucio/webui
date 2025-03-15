import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListDIDsRequest } from '@/lib/core/usecase-models/list-dids-usecase-models';
import { ListDIDsInputPort } from '@/lib/core/port/primary/list-dids-ports';
import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';
import USECASE_FACTORY from '../ioc/ioc-symbols-usecase-factory';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { parseDIDType } from '@/lib/common/did-utils';

export type ListDIDsControllerParameters = TAuthenticatedControllerParameters & {
    query: string;
    type: string;
};
@injectable()
class ListDIDsController extends BaseController<ListDIDsControllerParameters, AuthenticatedRequestModel<ListDIDsRequest>> {
    constructor(@inject(USECASE_FACTORY.LIST_DIDS) listDIDsUseCaseFactory: (response: NextApiResponse) => ListDIDsInputPort) {
        super(listDIDsUseCaseFactory);
    }
    prepareRequestModel(parameters: ListDIDsControllerParameters): AuthenticatedRequestModel<ListDIDsRequest> {
        return {
            query: parameters.query,
            type: parseDIDType(parameters.type),
            rucioAuthToken: parameters.rucioAuthToken,
        };
    }
}

export default ListDIDsController;
