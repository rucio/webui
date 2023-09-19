import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port"
import {
    GetRSEProtocolsError,
    GetRSEProtocolsRequest,
    GetRSEProtocolsResponse,
} from "@/lib/core/usecase-models/get-rse-protocols-usecase-models"
import { GetRSEProtocolsControllerParameters } from "@/lib/infrastructure/controller/get-rse-protocols-controller"
import GetRSEProtocolsController from "@/lib/infrastructure/controller/get-rse-protocols-controller"
import { RSEProtocolViewModel } from "@/lib/infrastructure/data/view-model/rse"
import {
    BaseFeature,
    IOCSymbols,
} from "@/lib/sdk/ioc-helpers"
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import INPUT_PORT from "@/lib/infrastructure/ioc/ioc-symbols-input-port"
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory"
import { Container } from 'inversify'

import GetRSEProtocolsUseCase from "@/lib/core/use-case/get-rse-protocols-usecase"

import GetRSEProtocolsPresenter from "@/lib/infrastructure/presenter/get-rse-protocols-presenter"




export default class GetRSEProtocolsFeature extends BaseFeature<
    GetRSEProtocolsControllerParameters,
    GetRSEProtocolsRequest,
    GetRSEProtocolsResponse,
    GetRSEProtocolsError,
    RSEProtocolViewModel[]
> {
    constructor(appContainer: Container) {
        const rseGateway = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE)
        
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.GET_RSE_PROTOCOLS,
            USECASE_FACTORY: USECASE_FACTORY.GET_RSE_PROTOCOLS,
            INPUT_PORT: INPUT_PORT.GET_RSE_PROTOCOLS,
        }
        const useCaseConstructorArgs = [
            rseGateway,
            
        ]
        super(
            'GetRSEProtocols',
            GetRSEProtocolsController,
            GetRSEProtocolsUseCase,
            useCaseConstructorArgs,
            GetRSEProtocolsPresenter,
            false,
            symbols
        )
    }
}