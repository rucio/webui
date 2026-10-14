import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListAccountAttributesRequest } from '@/lib/core/usecase-models/list-account-attributes-usecase-models';
import { ListAccountAttributesInputPort } from '@/lib/core/port/primary/list-account-attributes-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type ListAccountAttributesControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
};

@injectable()
class ListAccountAttributesController extends BaseController<
    ListAccountAttributesControllerParameters,
    AuthenticatedRequestModel<ListAccountAttributesRequest>
> {
    constructor(@inject(USECASE_FACTORY.LIST_ACCOUNT_ATTRIBUTES) useCaseFactory: (response: Signal) => ListAccountAttributesInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: ListAccountAttributesControllerParameters): AuthenticatedRequestModel<ListAccountAttributesRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
        };
    }
}

export default ListAccountAttributesController;
