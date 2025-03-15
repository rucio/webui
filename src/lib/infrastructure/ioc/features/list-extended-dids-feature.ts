import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import {
    ListExtendedDIDsError,
    ListExtendedDIDsRequest,
    ListExtendedDIDsResponse,
} from '@/lib/core/usecase-models/list-extended-dids-usecase-models';
import { ListExtendedDIDsControllerParameters } from '@/lib/infrastructure/controller/list-extended-dids-controller';
import ListExtendedDIDsController from '@/lib/infrastructure/controller/list-extended-dids-controller';
import { BaseStreamableFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import ListExtendedDIDsUseCase from '@/lib/core/use-case/list-extended-dids-usecase';

import ListExtendedDIDsPresenter from '@/lib/infrastructure/presenter/list-extended-dids-presenter';
import { ListExtendedDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';

export default class ListExtendedDIDsFeature extends BaseStreamableFeature<
    ListExtendedDIDsControllerParameters,
    ListExtendedDIDsRequest,
    ListExtendedDIDsResponse,
    ListExtendedDIDsError,
    ListExtendedDIDsViewModel
> {
    constructor(appContainer: Container) {
        const rucioDIDGateway = appContainer.get<DIDGatewayOutputPort>(GATEWAYS.DID);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_EXTENDED_DIDS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_EXTENDED_DIDS,
            INPUT_PORT: INPUT_PORT.LIST_EXTENDED_DIDS,
        };
        const useCaseConstructorArgs = [rucioDIDGateway];
        super(
            'ListExtendedDIDs',
            ListExtendedDIDsController,
            ListExtendedDIDsUseCase,
            useCaseConstructorArgs,
            ListExtendedDIDsPresenter,
            false,
            symbols,
        );
    }
}
