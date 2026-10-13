import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { DeleteAccountLimitRequest } from '@/lib/core/usecase-models/delete-account-limit-usecase-models';
import { DeleteAccountLimitInputPort } from '@/lib/core/port/primary/delete-account-limit-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { AccountLimitLocality } from '@/lib/core/entity/account';

export type DeleteAccountLimitControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    locality: AccountLimitLocality;
    rseExpression: string;
};

@injectable()
class DeleteAccountLimitController extends BaseController<
    DeleteAccountLimitControllerParameters,
    AuthenticatedRequestModel<DeleteAccountLimitRequest>
> {
    constructor(@inject(USECASE_FACTORY.DELETE_ACCOUNT_LIMIT) useCaseFactory: (response: Signal) => DeleteAccountLimitInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: DeleteAccountLimitControllerParameters): AuthenticatedRequestModel<DeleteAccountLimitRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
            locality: parameters.locality,
            rseExpression: parameters.rseExpression,
        };
    }
}

export default DeleteAccountLimitController;
