import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListAccountIdentitiesRequest } from '@/lib/core/usecase-models/list-account-identities-usecase-models';
import { ListAccountIdentitiesInputPort } from '@/lib/core/port/primary/list-account-identities-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type ListAccountIdentitiesControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
};

@injectable()
class ListAccountIdentitiesController extends BaseController<
    ListAccountIdentitiesControllerParameters,
    AuthenticatedRequestModel<ListAccountIdentitiesRequest>
> {
    constructor(@inject(USECASE_FACTORY.LIST_ACCOUNT_IDENTITIES) useCaseFactory: (response: Signal) => ListAccountIdentitiesInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: ListAccountIdentitiesControllerParameters): AuthenticatedRequestModel<ListAccountIdentitiesRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
        };
    }
}

export default ListAccountIdentitiesController;
