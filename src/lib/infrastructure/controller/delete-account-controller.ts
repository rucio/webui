import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { DeleteAccountRequest } from '@/lib/core/usecase-models/delete-account-usecase-models';
import { DeleteAccountInputPort } from '@/lib/core/port/primary/delete-account-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type DeleteAccountControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
};

@injectable()
class DeleteAccountController extends BaseController<DeleteAccountControllerParameters, AuthenticatedRequestModel<DeleteAccountRequest>> {
    constructor(@inject(USECASE_FACTORY.DELETE_ACCOUNT) useCaseFactory: (response: Signal) => DeleteAccountInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: DeleteAccountControllerParameters): AuthenticatedRequestModel<DeleteAccountRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
        };
    }
}

export default DeleteAccountController;
