import { injectable, inject } from "inversify";
import { NextApiResponse } from "next";

import { AuthenticatedRequestModel } from "@/lib/sdk/usecase-models";
import { BaseController, TAuthenticatedControllerParameters } from "@/lib/sdk/controller";
import { AttachDIDsRequest } from "@/lib/core/usecase-models/attach-dids-usecase-models";
import { AttachDIDsInputPort } from "@/lib/core/port/primary/attach-dids-ports";
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory";

export type AttachDIDsControllerParameters = TAuthenticatedControllerParameters & {
    scope: string,
    name: string,
    dids: {
        scope: string,
        name: string
    }[]
};

@injectable()
class AttachDIDsController extends BaseController<AttachDIDsControllerParameters, AuthenticatedRequestModel<AttachDIDsRequest>> {
    constructor(
        @inject(USECASE_FACTORY.ATTACH_DIDS) attachDIDsUseCaseFactory: (response: NextApiResponse) => AttachDIDsInputPort,
    ) {
        super(attachDIDsUseCaseFactory);
    }
    prepareRequestModel(parameters: AttachDIDsControllerParameters): AuthenticatedRequestModel<AttachDIDsRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            scope: parameters.scope,
            name: parameters.name,
            dids: parameters.dids,
        }
    }
}

export default AttachDIDsController;