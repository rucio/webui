import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { AddAccountIdentityRequest } from '@/lib/core/usecase-models/add-account-identity-usecase-models';
import { AddAccountIdentityInputPort } from '@/lib/core/port/primary/add-account-identity-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { IdentityType } from '@/lib/core/entity/account';

export type AddAccountIdentityControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    identity: string;
    authType: IdentityType;
    email: string;
    password?: string;
    isDefault?: boolean;
};

@injectable()
class AddAccountIdentityController extends BaseController<
    AddAccountIdentityControllerParameters,
    AuthenticatedRequestModel<AddAccountIdentityRequest>
> {
    constructor(@inject(USECASE_FACTORY.ADD_ACCOUNT_IDENTITY) useCaseFactory: (response: Signal) => AddAccountIdentityInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: AddAccountIdentityControllerParameters): AuthenticatedRequestModel<AddAccountIdentityRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
            identity: parameters.identity,
            authType: parameters.authType,
            email: parameters.email,
            password: parameters.password,
            isDefault: parameters.isDefault,
        };
    }
}

export default AddAccountIdentityController;
