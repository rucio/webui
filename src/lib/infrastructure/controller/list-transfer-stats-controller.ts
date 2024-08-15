import { ListTransferStatsInputPort } from "@/lib/core/port/primary/list-transfer-stats-ports";
import { ListTransferStatsRequest } from "@/lib/core/usecase-models/list-transfer-stats-usecase-models";
import { BaseController, TAuthenticatedControllerParameters } from "@/lib/sdk/controller";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { inject, injectable } from "inversify";
import { NextApiResponse } from "next";
import USECASE_FACTORY from "../ioc/ioc-symbols-usecase-factory";

export type ListTransferStatsControllerParameters = TAuthenticatedControllerParameters;

@injectable()
class ListTransferStatsController extends BaseController<ListTransferStatsControllerParameters, AuthenticatedRequestModel<ListTransferStatsRequest>> {
    constructor(
        @inject(USECASE_FACTORY.LIST_TRANSFER_STATS) listTransferStatsUseCaseFactory: (response: NextApiResponse) => ListTransferStatsInputPort,
    ) {
        super(listTransferStatsUseCaseFactory)
    }
    prepareRequestModel(parameters: ListTransferStatsControllerParameters): AuthenticatedRequestModel<ListTransferStatsRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken
        }
    }
}

export default ListTransferStatsController;