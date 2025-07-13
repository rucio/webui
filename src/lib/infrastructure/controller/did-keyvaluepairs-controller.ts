import { DIDKeyValuePairsDataInputPort } from '@/lib/core/port/primary/did-keyvaluepairs-ports';
import { DIDKeyValuePairsDataRequest } from '@/lib/core/usecase-models/did-keyvaluepairs-usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { Signal } from '@/lib/sdk/web';
import USECASE_FACTORY from '../ioc/ioc-symbols-usecase-factory';
import { inject, injectable } from 'inversify';

export type DIDKeyValuePairsDataControllerParameters = TAuthenticatedControllerParameters & {
    name: string;
    scope: string;
};

@injectable()
export default class DIDKeyValuePairsDataController extends BaseController<DIDKeyValuePairsDataControllerParameters, DIDKeyValuePairsDataRequest> {
    constructor(@inject(USECASE_FACTORY.DID_KEYVALUEPAIRS) didKeyValuePairsDataUseCaseFactory: (response: Signal) => DIDKeyValuePairsDataInputPort) {
        super(didKeyValuePairsDataUseCaseFactory);
    }

    prepareRequestModel(parameters: DIDKeyValuePairsDataControllerParameters): DIDKeyValuePairsDataRequest {
        return {
            did: parameters.name,
            scope: parameters.scope,
            rucioAuthToken: parameters.rucioAuthToken,
        } as DIDKeyValuePairsDataRequest;
    }
}
