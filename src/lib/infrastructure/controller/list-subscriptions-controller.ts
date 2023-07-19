import { ListSubscriptionsInputPort } from "@/lib/core/port/primary/list-subscriptions-port";
import { ListSubscriptionsRequest } from "@/lib/core/usecase-models/list-subscriptions-usecase-models";
import { BaseController, TAuthenticatedControllerParameters } from "@/lib/sdk/controller";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { inject, injectable } from "inversify";
import { NextApiResponse } from "next";
import USECASE_FACTORY from "../ioc/ioc-symbols-usecase-factory";

export type ListSubscriptionsControllerParameters = TAuthenticatedControllerParameters & {
    account: string;
    sessionAccount: string;
}

@injectable()
class ListSubscriptionsController extends BaseController<ListSubscriptionsControllerParameters, AuthenticatedRequestModel<ListSubscriptionsRequest>> {
    constructor(
        @inject(USECASE_FACTORY.LIST_SUBSCRIPTIONS) listSubscriptionsUseCaseFactory: (response: NextApiResponse) => ListSubscriptionsInputPort,
    ) {
        super(listSubscriptionsUseCaseFactory);
    }
    prepareRequestModel(parameters: ListSubscriptionsControllerParameters): AuthenticatedRequestModel<ListSubscriptionsRequest> {
        return {
            account: parameters.account,
            sessionAccount: parameters.sessionAccount,
            rucioAuthToken: parameters.rucioAuthToken
        }
    }
}

export default ListSubscriptionsController;