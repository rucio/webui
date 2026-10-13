import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { UpdateAccountAttributeRequest } from '@/lib/core/usecase-models/update-account-attribute-usecase-models';
import { UpdateAccountAttributeInputPort } from '@/lib/core/port/primary/update-account-attribute-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type UpdateAccountAttributeControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    key: string;
    value: string;
};

@injectable()
class UpdateAccountAttributeController extends BaseController<
    UpdateAccountAttributeControllerParameters,
    AuthenticatedRequestModel<UpdateAccountAttributeRequest>
> {
    constructor(@inject(USECASE_FACTORY.UPDATE_ACCOUNT_ATTRIBUTE) useCaseFactory: (response: Signal) => UpdateAccountAttributeInputPort) {
        super(useCaseFactory);
    }
    prepareRequestModel(parameters: UpdateAccountAttributeControllerParameters): AuthenticatedRequestModel<UpdateAccountAttributeRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
            key: parameters.key,
            value: parameters.value,
        };
    }
}

export default UpdateAccountAttributeController;
