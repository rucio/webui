import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { SetAccountLimitRequest } from '@/lib/core/usecase-models/set-account-limit-usecase-models';
import { SetAccountLimitInputPort } from '@/lib/core/port/primary/set-account-limit-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { AccountLimitLocality } from '@/lib/core/entity/account';

export type SetAccountLimitControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    locality: AccountLimitLocality;
    rseExpression: string;
    bytes: number;
};

@injectable()
class SetAccountLimitController extends BaseController<SetAccountLimitControllerParameters, AuthenticatedRequestModel<SetAccountLimitRequest>> {
    constructor(@inject(USECASE_FACTORY.SET_ACCOUNT_LIMIT) useCaseFactory: (response: Signal) => SetAccountLimitInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: SetAccountLimitControllerParameters): AuthenticatedRequestModel<SetAccountLimitRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
            locality: parameters.locality,
            rseExpression: parameters.rseExpression,
            bytes: parameters.bytes,
        };
    }
}

export default SetAccountLimitController;
