import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { AddDIDRequest } from '@/lib/core/usecase-models/add-did-usecase-models';
import { AddDIDInputPort } from '@/lib/core/port/primary/add-did-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type AddDIDControllerParameters = TAuthenticatedControllerParameters & {
    scope: string;
    name: string;
    type: string;
};

@injectable()
class AddDIDController extends BaseController<AddDIDControllerParameters, AuthenticatedRequestModel<AddDIDRequest>> {
    constructor(@inject(USECASE_FACTORY.ADD_DID) addDIDUseCaseFactory: (response: NextApiResponse) => AddDIDInputPort) {
        super(addDIDUseCaseFactory);
    }
    prepareRequestModel(parameters: AddDIDControllerParameters): AuthenticatedRequestModel<AddDIDRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            scope: parameters.scope,
            name: parameters.name,
            type: parameters.type,
        };
    }
}

export default AddDIDController;
