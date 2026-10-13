import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { DeleteAccountAttributeRequest } from '@/lib/core/usecase-models/delete-account-attribute-usecase-models';
import { DeleteAccountAttributeInputPort } from '@/lib/core/port/primary/delete-account-attribute-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type DeleteAccountAttributeControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    key: string;
};

@injectable()
class DeleteAccountAttributeController extends BaseController<
    DeleteAccountAttributeControllerParameters,
    AuthenticatedRequestModel<DeleteAccountAttributeRequest>
> {
    constructor(@inject(USECASE_FACTORY.DELETE_ACCOUNT_ATTRIBUTE) useCaseFactory: (response: Signal) => DeleteAccountAttributeInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: DeleteAccountAttributeControllerParameters): AuthenticatedRequestModel<DeleteAccountAttributeRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
            key: parameters.key,
        };
    }
}

export default DeleteAccountAttributeController;
