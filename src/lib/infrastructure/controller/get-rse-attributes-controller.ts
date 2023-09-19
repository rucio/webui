import { injectable, inject } from "inversify";
import { NextApiResponse } from "next";

import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { BaseController, TAuthenticatedControllerParameters } from "@/lib/sdk/controller";
import { GetRSEAttributesRequest } from "@/lib/core/usecase-models/get-rse-attributes-usecase-models";
import { GetRSEAttributesInputPort } from "@/lib/core/port/primary/get-rse-attributes-ports";
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory";

export type GetRSEAttributesControllerParameters = TAuthenticatedControllerParameters & {
    rseName: string;
};

@injectable()
class GetRSEAttributesController extends BaseController<GetRSEAttributesControllerParameters, AuthenticatedRequestModel<GetRSEAttributesRequest>> {
    constructor(
        @inject(USECASE_FACTORY.GET_RSE_ATTRIBUTES) getRSEAttributesUseCaseFactory: (response: NextApiResponse) => GetRSEAttributesInputPort,
    ) {
        super(getRSEAttributesUseCaseFactory);
    }
    prepareRequestModel(parameters: GetRSEAttributesControllerParameters): AuthenticatedRequestModel<GetRSEAttributesRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            rseName: parameters.rseName,
        }
    }
}

export default GetRSEAttributesController;