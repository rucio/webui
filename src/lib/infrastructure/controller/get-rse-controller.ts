import { injectable, inject } from "inversify";
import { NextApiResponse } from "next";

import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { BaseController, TAuthenticatedControllerParameters } from "@/lib/sdk/controller";
import { GetRSERequest } from "@/lib/core/usecase-models/get-rse-usecase-models";
import { GetRSEInputPort } from "@/lib/core/port/primary/get-rse-ports";
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory";

export type GetRSEControllerParameters = TAuthenticatedControllerParameters & {
    rseName: string;
};

@injectable()
class GetRSEController extends BaseController<GetRSEControllerParameters, AuthenticatedRequestModel<GetRSERequest>> {
    constructor(
        @inject(USECASE_FACTORY.GET_RSE) getRSEUseCaseFactory: (response: NextApiResponse) => GetRSEInputPort,
    ) {
        super(getRSEUseCaseFactory);
    }
    prepareRequestModel(parameters: GetRSEControllerParameters): AuthenticatedRequestModel<GetRSERequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            rseName: parameters.rseName,
        }
    }
}

export default GetRSEController;