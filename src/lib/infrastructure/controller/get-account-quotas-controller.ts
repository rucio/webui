import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { GetAccountQuotasRequest } from '@/lib/core/usecase-models/get-account-quotas-usecase-models';
import { GetAccountQuotasInputPort } from '@/lib/core/port/primary/get-account-quotas-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type GetAccountQuotasControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
};

@injectable()
class GetAccountQuotasController extends BaseController<GetAccountQuotasControllerParameters, AuthenticatedRequestModel<GetAccountQuotasRequest>> {
    constructor(@inject(USECASE_FACTORY.GET_ACCOUNT_QUOTAS) useCaseFactory: (response: Signal) => GetAccountQuotasInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: GetAccountQuotasControllerParameters): AuthenticatedRequestModel<GetAccountQuotasRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
        };
    }
}

export default GetAccountQuotasController;
