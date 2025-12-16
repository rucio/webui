import { GetSiteHeaderInputPort } from '@/lib/core/port/primary/get-site-header-ports';
import { GetSiteHeaderRequest } from '@/lib/core/usecase-models/get-site-header-usecase-models';
import { BaseController, TAuthenticatedControllerParameters, TSimpleControllerParameters } from '@/lib/sdk/controller';
import { inject, injectable } from 'inversify';
import { RucioSession } from '../auth/session';
import { Signal } from '@/lib/sdk/web';
import USECASE_FACTORY from '../ioc/ioc-symbols-usecase-factory';

// Note: TAuthenticatedControllerParameters is NOT required, but is used to avoid type errors
// Yes, it is a hack
export type GetSiteHeaderControllerParameters = TSimpleControllerParameters & {
    session: RucioSession;
};

@injectable()
class GetSiteHeaderController extends BaseController<GetSiteHeaderControllerParameters, GetSiteHeaderRequest> {
    constructor(@inject(USECASE_FACTORY.GET_SITE_HEADER) getSiteHeaderUseCaseFactory: (response: Signal) => GetSiteHeaderInputPort) {
        super(getSiteHeaderUseCaseFactory);
    }

    prepareRequestModel(parameters: GetSiteHeaderControllerParameters): GetSiteHeaderRequest {
        return {
            session: parameters.session,
        };
    }
}

export default GetSiteHeaderController;
