import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { DeleteAccountIdentityRequest } from '@/lib/core/usecase-models/delete-account-identity-usecase-models';
import { DeleteAccountIdentityInputPort } from '@/lib/core/port/primary/delete-account-identity-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { IdentityType } from '@/lib/core/entity/account';

export type DeleteAccountIdentityControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    identity: string;
    authType: IdentityType;
};

@injectable()
class DeleteAccountIdentityController extends BaseController<
    DeleteAccountIdentityControllerParameters,
    AuthenticatedRequestModel<DeleteAccountIdentityRequest>
> {
    constructor(@inject(USECASE_FACTORY.DELETE_ACCOUNT_IDENTITY) useCaseFactory: (response: Signal) => DeleteAccountIdentityInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: DeleteAccountIdentityControllerParameters): AuthenticatedRequestModel<DeleteAccountIdentityRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
            identity: parameters.identity,
            authType: parameters.authType,
        };
    }
}

export default DeleteAccountIdentityController;
