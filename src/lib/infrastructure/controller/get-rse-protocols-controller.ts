import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { GetRSEProtocolsRequest } from '@/lib/core/usecase-models/get-rse-protocols-usecase-models';
import { GetRSEProtocolsInputPort } from '@/lib/core/port/primary/get-rse-protocols-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type GetRSEProtocolsControllerParameters = TAuthenticatedControllerParameters & {
    rseName: string;
};

@injectable()
class GetRSEProtocolsController extends BaseController<GetRSEProtocolsControllerParameters, AuthenticatedRequestModel<GetRSEProtocolsRequest>> {
    constructor(@inject(USECASE_FACTORY.GET_RSE_PROTOCOLS) getRSEProtocolsUseCaseFactory: (response: NextApiResponse) => GetRSEProtocolsInputPort) {
        super(getRSEProtocolsUseCaseFactory);
    }
    prepareRequestModel(parameters: GetRSEProtocolsControllerParameters): AuthenticatedRequestModel<GetRSEProtocolsRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            rseName: parameters.rseName,
        };
    }
}

export default GetRSEProtocolsController;
