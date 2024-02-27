import { injectable, inject } from "inversify";
import { NextApiResponse } from "next";

import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { BaseController, TAuthenticatedControllerParameters } from "@/lib/sdk/controller";
import { ListRulesForAccountRequest } from "@/lib/core/usecase-models/list-rules-for-account-usecase-models";
import { ListRulesForAccountInputPort } from "@/lib/core/port/primary/list-rules-for-account-ports";
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory";
import { RuleState } from "@/lib/core/entity/rucio";

export type ListRulesForAccountControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    rseExpression: string;
    activity: string;
    ruleState: RuleState;
    from: Date;
    to: Date;
};

@injectable()
class ListRulesForAccountController extends BaseController<ListRulesForAccountControllerParameters, AuthenticatedRequestModel<ListRulesForAccountRequest>> {
    constructor(
        @inject(USECASE_FACTORY.LIST_RULES_FOR_ACCOUNT) listRulesForAccountUseCaseFactory: (response: NextApiResponse) => ListRulesForAccountInputPort,
    ) {
        super(listRulesForAccountUseCaseFactory);
    }
    prepareRequestModel(parameters: ListRulesForAccountControllerParameters): AuthenticatedRequestModel<ListRulesForAccountRequest> {
        return {
            ...parameters,
        }
    }
}

export default ListRulesForAccountController;