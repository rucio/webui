import { injectable, inject } from "inversify";
import { NextApiResponse } from "next";

import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { BaseController, TAuthenticatedControllerParameters } from "@/lib/sdk/controller";
import { ListAllRSEsRequest } from "@/lib/core/usecase-models/list-all-rses-usecase-models";
import { ListAllRSEsInputPort } from "@/lib/core/port/primary/list-all-rses-ports";
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory";

export type ListAllRSEsControllerParameters = TAuthenticatedControllerParameters & {};

@injectable()
class ListAllRSEsController extends BaseController<ListAllRSEsControllerParameters, AuthenticatedRequestModel<ListAllRSEsRequest>> {
    constructor(
        @inject(USECASE_FACTORY.LIST_ALL_RSES) listAllRSEsUseCaseFactory: (response: NextApiResponse) => ListAllRSEsInputPort,
    ) {
        super(listAllRSEsUseCaseFactory);
    }
    prepareRequestModel(parameters: ListAllRSEsControllerParameters): AuthenticatedRequestModel<ListAllRSEsRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken
        }
    }
}

export default ListAllRSEsController;