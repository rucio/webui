import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import { ListDIDParentsError, ListDIDParentsRequest, ListDIDParentsResponse } from '@/lib/core/usecase-models/list-did-parents-usecase-models';
import { ListDIDParentsControllerParameters } from '@/lib/infrastructure/controller/list-did-parents-controller';
import ListDIDParentsController from '@/lib/infrastructure/controller/list-did-parents-controller';
import { DIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { BaseStreamableFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import ListDIDParentsUseCase from '@/lib/core/use-case/list-did-parents-usecase';

import ListDIDParentsPresenter from '@/lib/infrastructure/presenter/list-did-parents-presenter';

export default class ListDIDParentsFeature extends BaseStreamableFeature<
    ListDIDParentsControllerParameters,
    ListDIDParentsRequest,
    ListDIDParentsResponse,
    ListDIDParentsError,
    DIDViewModel
> {
    constructor(appContainer: Container) {
        const didGateway = appContainer.get<DIDGatewayOutputPort>(GATEWAYS.DID);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_DID_PARENTS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_DID_PARENTS,
            INPUT_PORT: INPUT_PORT.LIST_DID_PARENTS,
        };
        const useCaseConstructorArgs = [didGateway];
        super('ListDIDParents', ListDIDParentsController, ListDIDParentsUseCase, useCaseConstructorArgs, ListDIDParentsPresenter, false, symbols);
    }
}
