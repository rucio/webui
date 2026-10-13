import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListAccountsRequest } from '@/lib/core/usecase-models/list-accounts-usecase-models';
import { ListAccountsInputPort } from '@/lib/core/port/primary/list-accounts-ports';
import { AccountListFilter } from '@/lib/core/entity/account';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type ListAccountsControllerParameters = TAuthenticatedControllerParameters & {
    filter: AccountListFilter;
};

@injectable()
class ListAccountsController extends BaseController<ListAccountsControllerParameters, AuthenticatedRequestModel<ListAccountsRequest>> {
    constructor(@inject(USECASE_FACTORY.LIST_ACCOUNTS) listAccountsUseCaseFactory: (response: Signal) => ListAccountsInputPort) {
        super(listAccountsUseCaseFactory);
    }
    prepareRequestModel(parameters: ListAccountsControllerParameters): AuthenticatedRequestModel<ListAccountsRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            filter: parameters.filter,
        };
    }
}

export default ListAccountsController;
