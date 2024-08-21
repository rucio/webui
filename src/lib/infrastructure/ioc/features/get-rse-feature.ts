import RSEGatewayOutputPort from '@/lib/core/port/secondary/rse-gateway-output-port';
import { GetRSEError, GetRSERequest, GetRSEResponse } from '@/lib/core/usecase-models/get-rse-usecase-models';
import { GetRSEControllerParameters } from '@/lib/infrastructure/controller/get-rse-controller';
import GetRSEController from '@/lib/infrastructure/controller/get-rse-controller';
import { RSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import GetRSEUseCase from '@/lib/core/use-case/get-rse-usecase';

import GetRSEPresenter from '@/lib/infrastructure/presenter/get-rse-presenter';

export default class GetRSEFeature extends BaseFeature<GetRSEControllerParameters, GetRSERequest, GetRSEResponse, GetRSEError, RSEViewModel> {
    constructor(appContainer: Container) {
        const rseGateway = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.GET_RSE,
            USECASE_FACTORY: USECASE_FACTORY.GET_RSE,
            INPUT_PORT: INPUT_PORT.GET_RSE,
        };
        const useCaseConstructorArgs = [rseGateway];
        super('GetRSE', GetRSEController, GetRSEUseCase, useCaseConstructorArgs, GetRSEPresenter, false, symbols);
    }
}
