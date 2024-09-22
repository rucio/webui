import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import { AddDIDError, AddDIDRequest, AddDIDResponse } from '@/lib/core/usecase-models/add-did-usecase-models';
import { AddDIDControllerParameters } from '@/lib/infrastructure/controller/add-did-controller';
import AddDIDController from '@/lib/infrastructure/controller/add-did-controller';
import { AddDIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import AddDIDUseCase from '@/lib/core/use-case/add-did-usecase';

import AddDIDPresenter from '@/lib/infrastructure/presenter/add-did-presenter';

export default class AddDIDFeature extends BaseFeature<AddDIDControllerParameters, AddDIDRequest, AddDIDResponse, AddDIDError, AddDIDViewModel> {
    constructor(appContainer: Container) {
        const rucioDIDGateway = appContainer.get<DIDGatewayOutputPort>(GATEWAYS.DID);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.ADD_DID,
            USECASE_FACTORY: USECASE_FACTORY.ADD_DID,
            INPUT_PORT: INPUT_PORT.ADD_DID,
        };
        const useCaseConstructorArgs = [rucioDIDGateway];
        super('AddDID', AddDIDController, AddDIDUseCase, useCaseConstructorArgs, AddDIDPresenter, false, symbols);
    }
}
