import { injectable, inject } from 'inversify';
import { NextApiResponse } from 'next';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListRulesRequest } from '@/lib/core/usecase-models/list-rules-usecase-models';
import { ListRulesInputPort } from '@/lib/core/port/primary/list-rules-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type ListRulesControllerParameters = TAuthenticatedControllerParameters & {
    scope?: string;
    account?: string;
    created_after?: string;
};

@injectable()
class ListRulesController extends BaseController<ListRulesControllerParameters, AuthenticatedRequestModel<ListRulesRequest>> {
    constructor(@inject(USECASE_FACTORY.LiST_RULES) listRulesUseCaseFactory: (response: NextApiResponse) => ListRulesInputPort) {
        super(listRulesUseCaseFactory);
    }
    prepareRequestModel(parameters: ListRulesControllerParameters): AuthenticatedRequestModel<ListRulesRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
            scope: parameters.scope,
            created_after: parameters.created_after ? new Date(parameters.created_after) : undefined,
        };
    }
}

export default ListRulesController;
