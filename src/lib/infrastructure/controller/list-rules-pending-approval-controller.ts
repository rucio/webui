import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';

import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { ListRulesPendingApprovalRequest } from '@/lib/core/usecase-models/list-rules-pending-approval-usecase-models';
import { ListRulesPendingApprovalInputPort } from '@/lib/core/port/primary/list-rules-pending-approval-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { RuleFilter } from '@/lib/core/entity/rucio';

export type ListRulesPendingApprovalControllerParameters = TAuthenticatedControllerParameters & {
    filters?: RuleFilter;
};

@injectable()
class ListRulesPendingApprovalController extends BaseController<
    ListRulesPendingApprovalControllerParameters,
    AuthenticatedRequestModel<ListRulesPendingApprovalRequest>
> {
    constructor(
        @inject(USECASE_FACTORY.LIST_RULES_PENDING_APPROVAL)
        listRulesPendingApprovalUseCaseFactory: (response: Signal) => ListRulesPendingApprovalInputPort,
    ) {
        super(listRulesPendingApprovalUseCaseFactory);
    }
    prepareRequestModel(
        parameters: ListRulesPendingApprovalControllerParameters,
    ): AuthenticatedRequestModel<ListRulesPendingApprovalRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            filters: parameters.filters,
        };
    }
}

export default ListRulesPendingApprovalController;
