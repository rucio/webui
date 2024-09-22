import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import { SetDIDStatusError, SetDIDStatusRequest, SetDIDStatusResponse } from '@/lib/core/usecase-models/set-did-status-usecase-models';
import { SetDIDStatusControllerParameters } from '@/lib/infrastructure/controller/set-did-status-controller';
import SetDIDStatusController from '@/lib/infrastructure/controller/set-did-status-controller';
import { SetDIDStatusViewModel } from '@/lib/infrastructure/data/view-model/did';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import SetDIDStatusUseCase from '@/lib/core/use-case/set-did-status-usecase';

import SetDIDStatusPresenter from '@/lib/infrastructure/presenter/set-did-status-presenter';

export default class SetDIDStatusFeature extends BaseFeature<
    SetDIDStatusControllerParameters,
    SetDIDStatusRequest,
    SetDIDStatusResponse,
    SetDIDStatusError,
    SetDIDStatusViewModel
> {
    constructor(appContainer: Container) {
        const rucioDIDGateway = appContainer.get<DIDGatewayOutputPort>(GATEWAYS.DID);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.SET_DID_STATUS,
            USECASE_FACTORY: USECASE_FACTORY.SET_DID_STATUS,
            INPUT_PORT: INPUT_PORT.SET_DID_STATUS,
        };
        const useCaseConstructorArgs = [rucioDIDGateway];
        super('SetDIDStatus', SetDIDStatusController, SetDIDStatusUseCase, useCaseConstructorArgs, SetDIDStatusPresenter, false, symbols);
    }
}
