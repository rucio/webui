import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListDIDsRequest } from '@/lib/core/usecase-models/list-dids-usecase-models';
import { DIDType } from '@/lib/core/entity/rucio';
import { ListDIDsInputPort } from '@/lib/core/port/primary/list-dids-ports';
import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';
import USECASE_FACTORY from '../ioc/ioc-symbols-usecase-factory';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { DIDFilter } from '@/lib/core/entity/rucio';

export type ListDIDsControllerParameters = TAuthenticatedControllerParameters & {
    query: string;
    type: string;
    filters: DIDFilter[];
};
@injectable()
class ListDIDsController extends BaseController<ListDIDsControllerParameters, AuthenticatedRequestModel<ListDIDsRequest>> {
    constructor(@inject(USECASE_FACTORY.LIST_DIDS) listDIDsUseCaseFactory: (response: Signal) => ListDIDsInputPort) {
        super(listDIDsUseCaseFactory);
    }
    prepareRequestModel(parameters: ListDIDsControllerParameters): AuthenticatedRequestModel<ListDIDsRequest> {
        const type = parameters.type.toLowerCase();
        let did_type = DIDType.ALL;
        switch (type) {
            case 'container': {
                did_type = DIDType.CONTAINER;
                break;
            }
            case 'dataset': {
                did_type = DIDType.DATASET;
                break;
            }
            case 'file': {
                did_type = DIDType.FILE;
                break;
            }
            default: {
                did_type = DIDType.ALL;
            }
        }
        return {
            query: parameters.query,
            type: did_type,
            rucioAuthToken: parameters.rucioAuthToken,
            filters: parameters.filters,
        };
    }
}

export default ListDIDsController;
