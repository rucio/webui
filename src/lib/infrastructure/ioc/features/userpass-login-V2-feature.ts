import AccountGatewayOutputPort from "@/lib/core/port/secondary/userpass-login-V2-gateway-output-port"
import { UserpassLoginV2Error, UserpassLoginV2Request, UserpassLoginV2Response } from "@/lib/core/usecase-models/userpass-login-V2-usecase-models"
import { UserpassLoginV2ControllerParameters } from "@/lib/infrastructure/controller/userpass-login-V2-controller"
import UserpassLoginV2Controller from "@/lib/infrastructure/controller/userpass-login-V2-controller"
import { UserpassLoginV2ViewModel } from "@/lib/infrastructure/data/view-model/UserpassloginV2"
import { BaseFeature, IOCSymbols } from "@/lib/sdk/ioc-helpers"
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import INPUT_PORT from "@/lib/infrastructure/ioc/ioc-symbols-input-port"
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory"
import { Container } from 'inversify'
import UserpassLoginV2UseCase from "@/lib/core/use-case/userpass-login-v2/userpass-login-V2-usecase"
import UserpassLoginV2Presenter from "@/lib/infrastructure/presenter/userpass-login-V2-presenter"
import AuthServerGatewayOutputPort from "@/lib/core/port/secondary/auth-server-gateway-output-port"

export default class UserpassLoginV2Feature extends BaseFeature<
    UserpassLoginV2ControllerParameters,
    UserpassLoginV2Request,
    UserpassLoginV2Response,
    UserpassLoginV2Error,
    UserpassLoginV2ViewModel
> {
    constructor(appContainer: Container) {
        const userpassLoginV2Gateway = appContainer.get<AuthServerGatewayOutputPort>(GATEWAYS.AUTH_SERVER)
        const accountGateway = appContainer.get<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT)
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.USERPASS_LOGIN_V2,
            USECASE_FACTORY: USECASE_FACTORY.USERPASS_LOGIN_V2,
            INPUT_PORT: INPUT_PORT.USERPASS_LOGIN_V2,
        }
        const useCaseConstructorArgs = [
            userpassLoginV2Gateway,
            accountGateway
        ]
        super(
            'UserpassLoginV2',
            UserpassLoginV2Controller,
            UserpassLoginV2UseCase,
            useCaseConstructorArgs,
            UserpassLoginV2Presenter,
            true,
            symbols
        )
    }
}