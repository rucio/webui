import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port'
import {
    ListDIDsError,
    ListDIDsRequest,
    ListDIDsResponse,
} from '@/lib/core/usecase-models/list-dids-usecase-models'
import { ListDIDsControllerParameters } from '@/lib/infrastructure/controller/list-dids-controller'
import { ListDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did'
import {
    BaseStreamableFeature,
    IFeature,
    IOCSymbols,
} from '@/lib/sdk/ioc-helpers'
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway'
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers'
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port'
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory'
import { Container } from 'inversify'
import ListDIDsController from '@/lib/infrastructure/controller/list-dids-controller'
import ListDIDsUseCase from '@/lib/core/use-case/list-dids-usecase'
import ListDIDsPresenter from '../../presenter/list-dids-presenter'

export default class ListDidsFeature extends BaseStreamableFeature<
    ListDIDsControllerParameters,
    ListDIDsRequest,
    ListDIDsResponse,
    ListDIDsError,
    ListDIDsViewModel
> {
    constructor(appContainer: Container) {
        const didGateway = appContainer.get<DIDGatewayOutputPort>(GATEWAYS.DID)
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_DIDS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_DIDS,
            INPUT_PORT: INPUT_PORT.LIST_DIDS,
        }
        super(
            'ListDIDs',
            ListDIDsController,
            ListDIDsUseCase,
            [didGateway],
            ListDIDsPresenter,
            false,
            symbols,
        )
    }
}
