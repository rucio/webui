import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListRulesRequest } from '@/lib/core/usecase-models/list-rules-usecase-models';
import { ListRulesInputPort } from '@/lib/core/port/primary/list-rules-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { RuleFilter } from '@/lib/core/entity/rucio';

export type ListRulesControllerParameters = TAuthenticatedControllerParameters & {
    filters?: RuleFilter;
};

@injectable()
class ListRulesController extends BaseController<ListRulesControllerParameters, AuthenticatedRequestModel<ListRulesRequest>> {
    constructor(@inject(USECASE_FACTORY.LiST_RULES) listRulesUseCaseFactory: (response: Signal) => ListRulesInputPort) {
        super(listRulesUseCaseFactory);
    }
    prepareRequestModel(parameters: ListRulesControllerParameters): AuthenticatedRequestModel<ListRulesRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            filters: parameters.filters,
        };
    }
}

export default ListRulesController;
