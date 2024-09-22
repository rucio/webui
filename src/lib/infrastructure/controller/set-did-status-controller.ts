import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { SetDIDStatusRequest } from '@/lib/core/usecase-models/set-did-status-usecase-models';
import { SetDIDStatusInputPort } from '@/lib/core/port/primary/set-did-status-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type SetDIDStatusControllerParameters = TAuthenticatedControllerParameters & {
    scope: string;
    name: string;
    open: boolean;
};

@injectable()
class SetDIDStatusController extends BaseController<SetDIDStatusControllerParameters, AuthenticatedRequestModel<SetDIDStatusRequest>> {
    constructor(@inject(USECASE_FACTORY.SET_DID_STATUS) setDIDStatusUseCaseFactory: (response: NextApiResponse) => SetDIDStatusInputPort) {
        super(setDIDStatusUseCaseFactory);
    }
    prepareRequestModel(parameters: SetDIDStatusControllerParameters): AuthenticatedRequestModel<SetDIDStatusRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            scope: parameters.scope,
            name: parameters.name,
            open: parameters.open,
        };
    }
}

export default SetDIDStatusController;
