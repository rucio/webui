import { ListDIDRulesInputPort } from "@/lib/core/port/primary/list-did-rules-ports";
import { ListDIDRulesRequest } from "@/lib/core/usecase-models/list-did-rules-usecase-models";
import { BaseController, TAuthenticatedControllerParameters } from "@/lib/sdk/controller";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { inject, injectable } from "inversify";
import { NextApiResponse } from "next";
import USECASE_FACTORY from "../ioc/ioc-symbols-usecase-factory";

export type ListDIDRulesControllerParameters = TAuthenticatedControllerParameters & {
    sessionAccount: string;
    name: string;
    scope: string;
}

@injectable()
class ListDIDRulesController extends BaseController<ListDIDRulesControllerParameters, AuthenticatedRequestModel<ListDIDRulesRequest>> {
    constructor(
        @inject(USECASE_FACTORY.LIST_DID_RULES) listDIDRulesUseCaseFactory: (response: NextApiResponse) => ListDIDRulesInputPort,
    ) {
        super(listDIDRulesUseCaseFactory);
    }
    
    prepareRequestModel(parameters: ListDIDRulesControllerParameters): AuthenticatedRequestModel<ListDIDRulesRequest> {
        const requestModel: AuthenticatedRequestModel<ListDIDRulesRequest> = {
            sessionAccount: parameters.sessionAccount,
            rucioAuthToken: parameters.rucioAuthToken,
            name: parameters.name,
            scope: parameters.scope,
        }
        return requestModel;
    }
}

export default ListDIDRulesController;