import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { GetAccountInfoRequest } from '@/lib/core/usecase-models/get-account-info-usecase-models';
import { GetAccountInfoInputPort } from '@/lib/core/port/primary/get-account-info-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type GetAccountInfoControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
};

@injectable()
class GetAccountInfoController extends BaseController<GetAccountInfoControllerParameters, AuthenticatedRequestModel<GetAccountInfoRequest>> {
    constructor(@inject(USECASE_FACTORY.GET_ACCOUNT_INFO) getAccountInfoUseCaseFactory: (response: Signal) => GetAccountInfoInputPort) {
        super(getAccountInfoUseCaseFactory);
    }
    prepareRequestModel(parameters: GetAccountInfoControllerParameters): AuthenticatedRequestModel<GetAccountInfoRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
        };
    }
}

export default GetAccountInfoController;
