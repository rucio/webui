import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { GetRuleRequest } from '@/lib/core/usecase-models/get-rule-usecase-models';
import { GetRuleInputPort } from '@/lib/core/port/primary/get-rule-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type GetRuleControllerParameters = TAuthenticatedControllerParameters & {
    id: string;
};

@injectable()
class GetRuleController extends BaseController<GetRuleControllerParameters, AuthenticatedRequestModel<GetRuleRequest>> {
    constructor(@inject(USECASE_FACTORY.GET_RULE) getRuleUseCaseFactory: (response: NextApiResponse) => GetRuleInputPort) {
        super(getRuleUseCaseFactory);
    }
    prepareRequestModel(parameters: GetRuleControllerParameters): AuthenticatedRequestModel<GetRuleRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            id: parameters.id,
        };
    }
}

export default GetRuleController;
