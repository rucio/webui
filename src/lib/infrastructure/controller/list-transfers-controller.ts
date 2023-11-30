import { ListTransfersInputPort } from "@/lib/core/port/primary/list-transfers-ports";
import { ListTransfersRequest } from "@/lib/core/usecase-models/list-transfers-usecase-models";
import { BaseController, TAuthenticatedControllerParameters } from "@/lib/sdk/controller";
import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { inject, injectable } from "inversify";
import { NextApiResponse } from "next";
import USECASE_FACTORY from "../ioc/ioc-symbols-usecase-factory";

export type ListTransfersControllerParameters = TAuthenticatedControllerParameters & {
    sourceRSE: string;
    destRSE: string;
};

@injectable()
class ListTransfersController extends BaseController<ListTransfersControllerParameters, AuthenticatedRequestModel<ListTransfersRequest>> {
    constructor(
        @inject(USECASE_FACTORY.LIST_TRANSFERS) listTransfersUseCaseFactory: (response: NextApiResponse) => ListTransfersInputPort,
    ) {
        super(listTransfersUseCaseFactory);
    }
    prepareRequestModel(parameters: ListTransfersControllerParameters): AuthenticatedRequestModel<ListTransfersRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            sourceRSE: parameters.sourceRSE,
            destRSE: parameters.destRSE,
        }
    }
}

export default ListTransfersController;