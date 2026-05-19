import { GetDDMLinkError, GetDDMLinkRequest, GetDDMLinkResponse } from '@/lib/core/usecase-models/get-ddm-link-usecase-models';
import { GetDDMLinkControllerParameters } from '@/lib/infrastructure/controller/get-ddm-link-controller';
import GetDDMLinkController from '@/lib/infrastructure/controller/get-ddm-link-controller';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import GetDDMLinkUseCase from '@/lib/core/use-case/get-ddm-link-usecase';

import GetDDMLinkPresenter from '@/lib/infrastructure/presenter/get-ddm-link-presenter';
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import { DDMLinkViewModel } from '../../data/view-model/request';

export default class GetDDMLinkFeature extends BaseFeature<
    GetDDMLinkControllerParameters,
    GetDDMLinkRequest,
    GetDDMLinkResponse,
    GetDDMLinkError,
    DDMLinkViewModel
> {
    constructor(appContainer: Container) {
        const envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.GET_DDM_LINK,
            USECASE_FACTORY: USECASE_FACTORY.GET_DDM_LINK,
            INPUT_PORT: INPUT_PORT.GET_DDM_LINK,
        };
        const useCaseConstructorArgs = [envConfigGateway];
        super('GetDDMLink', GetDDMLinkController, GetDDMLinkUseCase, useCaseConstructorArgs, GetDDMLinkPresenter, false, symbols);
    }
}
