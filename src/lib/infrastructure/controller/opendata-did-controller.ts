import { OpenDataDIDInputPort } from '@/lib/core/port/primary/opendata-did-ports';
import { OpenDataDIDRequest } from '@/lib/core/usecase-models/opendata-did-usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { inject, injectable } from 'inversify';
import { Signal } from '@/lib/sdk/web';
import USECASE_FACTORY from '../ioc/ioc-symbols-usecase-factory';

export type OpenDataDIDControllerParameters = TAuthenticatedControllerParameters & {
    name: string;
    scope: string;
};

@injectable()
export default class OpenDataDIDController extends BaseController<OpenDataDIDControllerParameters, OpenDataDIDRequest> {
    constructor(
        @inject(USECASE_FACTORY.OPENDATA_DID)
        openDataDIDUseCaseFactory: (response: Signal) => OpenDataDIDInputPort,
    ) {
        super(openDataDIDUseCaseFactory);
    }

    prepareRequestModel(parameters: OpenDataDIDControllerParameters): OpenDataDIDRequest {
        return {
            did: parameters.name,
            scope: parameters.scope,
            rucioAuthToken: parameters.rucioAuthToken,
        } as OpenDataDIDRequest;
    }
}
