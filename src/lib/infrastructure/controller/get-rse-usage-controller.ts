import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { GetRSEUsageRequest } from '@/lib/core/usecase-models/get-rse-usage-usecase-models';
import { GetRSEUsageInputPort } from '@/lib/core/port/primary/get-rse-usage-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type GetRSEUsageControllerParameters = TAuthenticatedControllerParameters & {
    rseName: string;
};

@injectable()
class GetRSEUsageController extends BaseController<GetRSEUsageControllerParameters, AuthenticatedRequestModel<GetRSEUsageRequest>> {
    constructor(@inject(USECASE_FACTORY.GET_RSE_USAGE) getRSEUsageUseCaseFactory: (response: Signal) => GetRSEUsageInputPort) {
        super(getRSEUsageUseCaseFactory);
    }
    prepareRequestModel(parameters: GetRSEUsageControllerParameters): AuthenticatedRequestModel<GetRSEUsageRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            rseName: parameters.rseName,
        };
    }
}

export default GetRSEUsageController;
