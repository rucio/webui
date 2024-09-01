import {
    DIDKeyValuePairsDataRequest,
    DIDKeyValuePairsDataResponse,
    DIDKeyValuePairsDataError,
} from '@/lib/core/usecase-models/did-keyvaluepairs-usecase-models';
import { BaseFeature } from '@/lib/sdk/ioc-helpers';
import DIDKeyValuePairsDataController, { DIDKeyValuePairsDataControllerParameters } from '../../controller/did-keyvaluepairs-controller';
import { DIDKeyValuePairsDataViewModel } from '../../data/view-model/did';
import { Container } from 'inversify';
import { DIDKeyValuePairsDataOutputPort } from '@/lib/core/port/primary/did-keyvaluepairs-ports';
import INPUT_PORT from '../ioc-symbols-input-port';
import GATEWAYS from '../ioc-symbols-gateway';
import CONTROLLERS from '../ioc-symbols-controllers';
import USECASE_FACTORY from '../ioc-symbols-usecase-factory';
import DIDKeyValuePairsDataUseCase from '@/lib/core/use-case/get-did-keyvaluepairs-usecase';
import DIDKeyValuePairsDataPresenter from '../../presenter/did-keyvaluepairs-presenter';

export default class DIDKeyValuePairsDataFeature extends BaseFeature<
    DIDKeyValuePairsDataControllerParameters,
    DIDKeyValuePairsDataRequest,
    DIDKeyValuePairsDataResponse,
    DIDKeyValuePairsDataError,
    DIDKeyValuePairsDataViewModel
> {
    constructor(appContainer: Container) {
        const gateway: DIDKeyValuePairsDataOutputPort = appContainer.get(GATEWAYS.DID);
        const symbols = {
            CONTROLLER: CONTROLLERS.DID_KEYVALUEPAIRS,
            USECASE_FACTORY: USECASE_FACTORY.DID_KEYVALUEPAIRS,
            INPUT_PORT: INPUT_PORT.DID_KEYVALUEPAIRS,
        };
        super(
            'DIDKeyValuePairsData',
            DIDKeyValuePairsDataController,
            DIDKeyValuePairsDataUseCase,
            [gateway],
            DIDKeyValuePairsDataPresenter,
            false,
            symbols,
        );
    }
}
