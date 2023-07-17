import { DIDMetaInputPort } from "@/lib/core/port/primary/did-meta-ports";
import { DIDMetaRequest } from "@/lib/core/usecase-models/did-meta-usecase-models";
import { BaseController, TAuthenticatedControllerParameters } from "@/lib/sdk/controller";
import { inject, injectable } from "inversify";
import { NextApiResponse } from "next";
import USECASE_FACTORY from "../ioc/ioc-symbols-usecase-factory";

export type DIDMetaControllerParameters = TAuthenticatedControllerParameters & {
    name: string;
    scope: string;
}

@injectable()
export default class DIDMetaController extends BaseController<DIDMetaControllerParameters, DIDMetaRequest> {
    
    constructor(
        @inject(USECASE_FACTORY.DID_META) didMetaUseCaseFactory: (response: NextApiResponse) => DIDMetaInputPort,
    ) {
        super(didMetaUseCaseFactory);
    }
    
    prepareRequestModel(parameters: DIDMetaControllerParameters): DIDMetaRequest {
        return {
            did: parameters.name,
            scope: parameters.scope,
            rucioAuthToken: parameters.rucioAuthToken
        } as DIDMetaRequest;
    }
}