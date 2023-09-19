import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port"
import {
    GetRSEAttributesError,
    GetRSEAttributesRequest,
    GetRSEAttributesResponse,
} from "@/lib/core/usecase-models/get-rse-attributes-usecase-models"
import { GetRSEAttributesControllerParameters } from "@/lib/infrastructure/controller/get-rse-attributes-controller"
import GetRSEAttributesController from "@/lib/infrastructure/controller/get-rse-attributes-controller"
import { RSEAttributeViewModel } from "@/lib/infrastructure/data/view-model/rse"
import {
    BaseFeature,
    IOCSymbols,
} from "@/lib/sdk/ioc-helpers"
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import INPUT_PORT from "@/lib/infrastructure/ioc/ioc-symbols-input-port"
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory"
import { Container } from 'inversify'

import GetRSEAttributesUseCase from "@/lib/core/use-case/get-rse-attributes-usecase"

import GetRSEAttributesPresenter from "@/lib/infrastructure/presenter/get-rse-attributes-presenter"




export default class GetRSEAttributesFeature extends BaseFeature<
    GetRSEAttributesControllerParameters,
    GetRSEAttributesRequest,
    GetRSEAttributesResponse,
    GetRSEAttributesError,
    RSEAttributeViewModel
> {
    constructor(appContainer: Container) {
        const rseGateway = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RSE)
        
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.GET_RSE_ATTRIBUTES,
            USECASE_FACTORY: USECASE_FACTORY.GET_RSE_ATTRIBUTES,
            INPUT_PORT: INPUT_PORT.GET_RSE_ATTRIBUTES,
        }
        const useCaseConstructorArgs = [
            rseGateway,
            
        ]
        super(
            'GetRSEAttributes',
            GetRSEAttributesController,
            GetRSEAttributesUseCase,
            useCaseConstructorArgs,
            GetRSEAttributesPresenter,
            false,
            symbols
        )
    }
}