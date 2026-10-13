import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { UpdateAccountRequest } from '@/lib/core/usecase-models/update-account-usecase-models';
import { UpdateAccountInputPort } from '@/lib/core/port/primary/update-account-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { AccountUpdateOptions } from '@/lib/core/entity/account';

export type UpdateAccountControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    options: AccountUpdateOptions;
};

@injectable()
class UpdateAccountController extends BaseController<UpdateAccountControllerParameters, AuthenticatedRequestModel<UpdateAccountRequest>> {
    constructor(@inject(USECASE_FACTORY.UPDATE_ACCOUNT) useCaseFactory: (response: Signal) => UpdateAccountInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: UpdateAccountControllerParameters): AuthenticatedRequestModel<UpdateAccountRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
            options: parameters.options,
        };
    }
}

export default UpdateAccountController;
