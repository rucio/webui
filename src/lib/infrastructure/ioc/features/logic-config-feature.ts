import EnvConfigGatewayOutputPort from "@/lib/core/port/secondary/env-config-gateway-output-port"
import LoginConfigUseCase from "@/lib/core/use-case/login-config-usecase"
import { LoginConfigError, LoginConfigResponse } from "@/lib/core/usecase-models/login-config-usecase-models"
import { BaseFeature, IOCSymbols } from "@/lib/sdk/ioc-helpers"
import { Container } from "inversify"
import LoginConfigController, { LoginConfigControllerParams } from "../../controller/login-config-controller"
import { LoginViewModel } from "../../data/view-model/login"
import EnvConfigGateway from "../../gateway/env-config-gateway"
import LoginConfigPresenter from "../../presenter/login-config-presenter"
import CONTROLLERS from "../ioc-symbols-controllers"
import GATEWAYS from "../ioc-symbols-gateway"
import INPUT_PORT from "../ioc-symbols-input-port"
import USECASE_FACTORY from "../ioc-symbols-usecase-factory"

export default class LoginConfigFeature extends BaseFeature<
    LoginConfigControllerParams,
    void,
    LoginConfigResponse,
    LoginConfigError,
    LoginViewModel
> {
    constructor(appContainer: Container) {
        const envGateway: EnvConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG)
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LOGIN_CONFIG,
            USECASE_FACTORY: USECASE_FACTORY.LOGIN_CONFIG,
            INPUT_PORT: INPUT_PORT.LOGIN_CONFIG,
        }
        super(
            "LoginConfig",
            LoginConfigController,
            LoginConfigUseCase,
            [
                envGateway,
            ],
            LoginConfigPresenter,
            true,
            symbols
        )
    }
}