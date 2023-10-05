import { injectable, inject } from "inversify";
import { NextApiResponse } from "next";

import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { BaseController, TAuthenticatedControllerParameters } from "@/lib/sdk/controller";
import { ListSubscriptionRuleStatesRequest } from "@/lib/core/usecase-models/list-subscription-rule-states-usecase-models";
import { ListSubscriptionRuleStatesInputPort } from "@/lib/core/port/primary/list-subscription-rule-states-ports";
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory";

export type ListSubscriptionRuleStatesControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    subscriptionName: string;
};

@injectable()
class ListSubscriptionRuleStatesController extends BaseController<ListSubscriptionRuleStatesControllerParameters, AuthenticatedRequestModel<ListSubscriptionRuleStatesRequest>> {
    constructor(
        @inject(USECASE_FACTORY.LIST_SUBSCRIPTION_RULE_STATES) listSubscriptionRuleStatesUseCaseFactory: (response: NextApiResponse) => ListSubscriptionRuleStatesInputPort,
    ) {
        super(listSubscriptionRuleStatesUseCaseFactory);
    }
    prepareRequestModel(parameters: ListSubscriptionRuleStatesControllerParameters): AuthenticatedRequestModel<ListSubscriptionRuleStatesRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.account,
            name: parameters.subscriptionName,
        }
    }
}

export default ListSubscriptionRuleStatesController;