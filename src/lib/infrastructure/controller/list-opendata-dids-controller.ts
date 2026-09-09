import { ListOpenDataDIDsInputPort } from '@/lib/core/port/primary/list-opendata-dids-ports';
import { ListOpenDataDIDsRequest } from '@/lib/core/usecase-models/list-opendata-dids-usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { inject, injectable } from 'inversify';
import { Signal } from '@/lib/sdk/web';
import USECASE_FACTORY from '../ioc/ioc-symbols-usecase-factory';

export type ListOpenDataDIDsControllerParameters = TAuthenticatedControllerParameters & {
    limit?: string;
    offset?: string;
    state?: string;
};

@injectable()
export default class ListOpenDataDIDsController extends BaseController<ListOpenDataDIDsControllerParameters, ListOpenDataDIDsRequest> {
    constructor(
        @inject(USECASE_FACTORY.LIST_OPENDATA_DIDS)
        listOpenDataDIDsUseCaseFactory: (response: Signal) => ListOpenDataDIDsInputPort,
    ) {
        super(listOpenDataDIDsUseCaseFactory);
    }

    prepareRequestModel(parameters: ListOpenDataDIDsControllerParameters): ListOpenDataDIDsRequest {
        return {
            limit: parameters.limit !== undefined ? Number(parameters.limit) : undefined,
            offset: parameters.offset !== undefined ? Number(parameters.offset) : undefined,
            state: parameters.state,
            rucioAuthToken: parameters.rucioAuthToken,
        } as ListOpenDataDIDsRequest;
    }
}
