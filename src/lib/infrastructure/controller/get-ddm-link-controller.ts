import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { GetDDMLinkRequest } from '@/lib/core/usecase-models/get-ddm-link-usecase-models';
import { GetDDMLinkInputPort } from '@/lib/core/port/primary/get-ddm-link-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type GetDDMLinkControllerParameters = TAuthenticatedControllerParameters & {
    scope: string;
    name: string;
    rse: string;
};

@injectable()
class GetDDMLinkController extends BaseController<GetDDMLinkControllerParameters, AuthenticatedRequestModel<GetDDMLinkRequest>> {
    constructor(@inject(USECASE_FACTORY.GET_DDM_LINK) GetDDMLinkUseCaseFactory: (response: Signal) => GetDDMLinkInputPort) {
        super(GetDDMLinkUseCaseFactory);
    }
    prepareRequestModel(parameters: GetDDMLinkControllerParameters): AuthenticatedRequestModel<GetDDMLinkRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            scope: parameters.scope,
            name: parameters.name,
            rse: parameters.rse,
        };
    }
}

export default GetDDMLinkController;
