import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { GetFTSLinkRequest } from '@/lib/core/usecase-models/get-fts-link-usecase-models';
import { GetFTSLinkInputPort } from '@/lib/core/port/primary/get-fts-link-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type GetFTSLinkControllerParameters = TAuthenticatedControllerParameters & {
    scope: string;
    name: string;
    rse: string;
};

@injectable()
class GetFTSLinkController extends BaseController<GetFTSLinkControllerParameters, AuthenticatedRequestModel<GetFTSLinkRequest>> {
    constructor(@inject(USECASE_FACTORY.GET_FTS_LINK) GetFTSLinkUseCaseFactory: (response: NextApiResponse) => GetFTSLinkInputPort) {
        super(GetFTSLinkUseCaseFactory);
    }
    prepareRequestModel(parameters: GetFTSLinkControllerParameters): AuthenticatedRequestModel<GetFTSLinkRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            scope: parameters.scope,
            name: parameters.name,
            rse: parameters.rse,
        };
    }
}

export default GetFTSLinkController;
