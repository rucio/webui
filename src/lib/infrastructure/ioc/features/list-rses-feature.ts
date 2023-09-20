import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port"
import {
    ListRSEsError,
    ListRSEsRequest,
    ListRSEsResponse,
} from "@/lib/core/usecase-models/list-rses-usecase-models"
import { ListRSEsControllerParameters } from "@/lib/infrastructure/controller/list-rses-controller"
import ListRSEsController from "@/lib/infrastructure/controller/list-rses-controller"
import { RSEViewModel } from "@/lib/infrastructure/data/view-model/rse"
import {
    BaseStreamableFeature,
    IOCSymbols,
} from "@/lib/sdk/ioc-helpers"
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import INPUT_PORT from "@/lib/infrastructure/ioc/ioc-symbols-input-port"
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory"
import { Container } from 'inversify'

import ListRSEsUseCase from "@/lib/core/use-case/list-rses/list-rses-usecase"
import ListRSEsPresenter from "@/lib/infrastructure/presenter/list-rses-presenter"

export default class ListRSEsFeature extends BaseStreamableFeature<
    ListRSEsControllerParameters,
    ListRSEsRequest,
    ListRSEsResponse,
    ListRSEsError,
    RSEViewModel
> {
    constructor(appContainer: Container) {
        const rseGateway: RSEGatewayOutputPort = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE)
        
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_RSES,
            USECASE_FACTORY: USECASE_FACTORY.LIST_RSES,
            INPUT_PORT: INPUT_PORT.LIST_RSES,
        }
        const useCaseConstructorArgs = [
            rseGateway,
            rseGateway,
        ]
        super(
            'ListRSEs',
            ListRSEsController,
            ListRSEsUseCase,
            useCaseConstructorArgs,
            ListRSEsPresenter,
            false,
            symbols
        )
    }
}