import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListAccountRSEUsageRequest } from '@/lib/core/usecase-models/list-account-rse-usage-usecase-models';
import { ListAccountRSEUsageInputPort } from '@/lib/core/port/primary/list-account-rse-usage-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type ListAccountRSEUsageControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
};

@injectable()
class ListAccountRSEUsageController extends BaseController<
    ListAccountRSEUsageControllerParameters,
    AuthenticatedRequestModel<ListAccountRSEUsageRequest>
> {
    constructor(
        @inject(USECASE_FACTORY.LIST_ACCOUNT_RSE_USAGE)
        listAccountRSEUsageUseCaseFactory: (response: NextApiResponse) => ListAccountRSEUsageInputPort,
    ) {
        super(listAccountRSEUsageUseCaseFactory);
    }
    prepareRequestModel(parameters: ListAccountRSEUsageControllerParameters): AuthenticatedRequestModel<ListAccountRSEUsageRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
        };
    }
}

export default ListAccountRSEUsageController;
