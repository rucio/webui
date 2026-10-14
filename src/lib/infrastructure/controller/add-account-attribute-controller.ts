import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { AddAccountAttributeRequest } from '@/lib/core/usecase-models/add-account-attribute-usecase-models';
import { AddAccountAttributeInputPort } from '@/lib/core/port/primary/add-account-attribute-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type AddAccountAttributeControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    key: string;
    value: string;
};

@injectable()
class AddAccountAttributeController extends BaseController<
    AddAccountAttributeControllerParameters,
    AuthenticatedRequestModel<AddAccountAttributeRequest>
> {
    constructor(@inject(USECASE_FACTORY.ADD_ACCOUNT_ATTRIBUTE) useCaseFactory: (response: Signal) => AddAccountAttributeInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: AddAccountAttributeControllerParameters): AuthenticatedRequestModel<AddAccountAttributeRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
            key: parameters.key,
            value: parameters.value,
        };
    }
}

export default AddAccountAttributeController;
