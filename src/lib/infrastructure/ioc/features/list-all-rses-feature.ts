import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port"
import {
    ListAllRSEsError,
    ListAllRSEsRequest,
    ListAllRSEsResponse,
} from "@/lib/core/usecase-models/list-all-rses-usecase-models"
import { ListAllRSEsControllerParameters } from "@/lib/infrastructure/controller/list-all-rses-controller"
import ListAllRSEsController from "@/lib/infrastructure/controller/list-all-rses-controller"
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

import ListAllRSEsUseCase from "@/lib/core/use-case/list-all-rses-usecase"

import ListAllRSEsPresenter from "@/lib/infrastructure/presenter/list-all-rses-presenter"



export default class ListAllRSEsFeature extends BaseStreamableFeature<
    ListAllRSEsControllerParameters,
    ListAllRSEsRequest,
    ListAllRSEsResponse,
    ListAllRSEsError,
    RSEViewModel
> {
    constructor(appContainer: Container) {
        const rseGateway = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE)
        
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_ALL_RSES,
            USECASE_FACTORY: USECASE_FACTORY.LIST_ALL_RSES,
            INPUT_PORT: INPUT_PORT.LIST_ALL_RSES,
        }
        const useCaseConstructorArgs = [
            rseGateway,
            
        ]
        super(
            'ListAllRSEs',
            ListAllRSEsController,
            ListAllRSEsUseCase,
            useCaseConstructorArgs,
            ListAllRSEsPresenter,
            false,
            symbols
        )
    }
}