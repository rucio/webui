import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port"
import {
    GetRSEUsageError,
    GetRSEUsageRequest,
    GetRSEUsageResponse,
} from "@/lib/core/usecase-models/get-rse-usage-usecase-models"
import { GetRSEUsageControllerParameters } from "@/lib/infrastructure/controller/get-rse-usage-controller"
import GetRSEUsageController from "@/lib/infrastructure/controller/get-rse-usage-controller"
import { RSEUsageViewModel } from "@/lib/infrastructure/data/view-model/rse-usage"
import {
    BaseFeature,
    IOCSymbols,
} from "@/lib/sdk/ioc-helpers"
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import INPUT_PORT from "@/lib/infrastructure/ioc/ioc-symbols-input-port"
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory"
import { Container } from 'inversify'

import GetRSEUsageUseCase from "@/lib/core/use-case/get-rse-usage-usecase"

import GetRSEUsagePresenter from "@/lib/infrastructure/presenter/get-rse-usage-presenter"




export default class GetRSEUsageFeature extends BaseFeature<
    GetRSEUsageControllerParameters,
    GetRSEUsageRequest,
    GetRSEUsageResponse,
    GetRSEUsageError,
    RSEUsageViewModel
> {
    constructor(appContainer: Container) {
        const rseGateway = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE)
        
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.GET_RSE_USAGE,
            USECASE_FACTORY: USECASE_FACTORY.GET_RSE_USAGE,
            INPUT_PORT: INPUT_PORT.GET_RSE_USAGE,
        }
        const useCaseConstructorArgs = [
            rseGateway,
            
        ]
        super(
            'GetRSEUsage',
            GetRSEUsageController,
            GetRSEUsageUseCase,
            useCaseConstructorArgs,
            GetRSEUsagePresenter,
            false,
            symbols
        )
    }
}