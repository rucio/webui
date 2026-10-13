import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { CreateAccountRequest } from '@/lib/core/usecase-models/create-account-usecase-models';
import { CreateAccountInputPort } from '@/lib/core/port/primary/create-account-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { AccountType } from '@/lib/core/entity/rucio';

export type CreateAccountControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    accountType: AccountType;
    email: string | null;
};

@injectable()
class CreateAccountController extends BaseController<CreateAccountControllerParameters, AuthenticatedRequestModel<CreateAccountRequest>> {
    constructor(@inject(USECASE_FACTORY.CREATE_ACCOUNT) useCaseFactory: (response: Signal) => CreateAccountInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: CreateAccountControllerParameters): AuthenticatedRequestModel<CreateAccountRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
            accountType: parameters.accountType,
            email: parameters.email,
        };
    }
}

export default CreateAccountController;
