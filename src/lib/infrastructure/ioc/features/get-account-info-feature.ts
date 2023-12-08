import AccountGatewayOutputPort from "@/lib/core/port/secondary/account-gateway-output-port"
import {
    GetAccountInfoError,
    GetAccountInfoRequest,
    GetAccountInfoResponse,
} from "@/lib/core/usecase-models/get-account-info-usecase-models"
import { GetAccountInfoControllerParameters } from "@/lib/infrastructure/controller/get-account-info-controller"
import GetAccountInfoController from "@/lib/infrastructure/controller/get-account-info-controller"
import { AccountInfoViewModel } from "@/lib/infrastructure/data/view-model/account"
import {
    BaseFeature,
    IOCSymbols,
} from "@/lib/sdk/ioc-helpers"
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import INPUT_PORT from "@/lib/infrastructure/ioc/ioc-symbols-input-port"
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory"
import { Container } from 'inversify'

import GetAccountInfoUseCase from "@/lib/core/use-case/get-account-info-usecase"

import GetAccountInfoPresenter from "@/lib/infrastructure/presenter/get-account-info-presenter"




export default class GetAccountInfoFeature extends BaseFeature<
    GetAccountInfoControllerParameters,
    GetAccountInfoRequest,
    GetAccountInfoResponse,
    GetAccountInfoError,
    AccountInfoViewModel
> {
    constructor(appContainer: Container) {
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT)
        
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.GET_ACCOUNT_INFO,
            USECASE_FACTORY: USECASE_FACTORY.GET_ACCOUNT_INFO,
            INPUT_PORT: INPUT_PORT.GET_ACCOUNT_INFO,
        }
        const useCaseConstructorArgs = [
            accountGateway,
            
        ]
        super(
            'GetAccountInfo',
            GetAccountInfoController,
            GetAccountInfoUseCase,
            useCaseConstructorArgs,
            GetAccountInfoPresenter,
            false,
            symbols
        )
    }
}