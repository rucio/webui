import "reflect-metadata";
import { Container, interfaces } from "inversify";
import UserPassLoginInputPort from "@/lib/core/port/primary/userpass-login-input-port";
import { NextApiResponse } from "next";
import CONTROLLERS from "./ioc-symbols-controllers";
import INPUT_PORT from "../../../common/ioc/ioc-symbols-input-port";
import USECASE_FACTORY from "./ioc-symbols-usecase-factory";
import UserPassLoginUseCase from "@/lib/core/use-case/userpass-login-usecase";
import UserPassLoginController, {IUserPassLoginController} from "@/lib/infrastructure/controller/userpass-login-controller";
import UserPassLoginPresenter from "@/lib/infrastructure/presenter/usepass-login-presenter";
import AuthServerGatewayOutputPort from "@/lib/core/port/secondary/auth-server-gateway-output-port";
import GATEWAYS from "./ioc-symbols-gateway";
import RucioAuthServer from "@/lib/infrastructure/gateway/rucio-auth-server";

/**
 * IoC Container configuration for the application.
 */
const appContainer = new Container();

appContainer.bind<AuthServerGatewayOutputPort>(GATEWAYS.AUTH_SERVER).to(RucioAuthServer);

appContainer.bind<UserPassLoginInputPort>(INPUT_PORT.USERPASS_LOGIN).to(UserPassLoginUseCase).inRequestScope();
appContainer.bind<IUserPassLoginController>(CONTROLLERS.USERPASS_LOGIN).to(UserPassLoginController);
appContainer.bind<interfaces.Factory<UserPassLoginInputPort>>(USECASE_FACTORY.USERPASS_LOGIN).toFactory<UserPassLoginUseCase, [NextApiResponse]>((context: interfaces.Context) =>
    (response: NextApiResponse) => {
        const rucioAuthServer: AuthServerGatewayOutputPort = appContainer.get(GATEWAYS.AUTH_SERVER)
        return new UserPassLoginUseCase(new UserPassLoginPresenter(response), rucioAuthServer);
    }
);

export default appContainer;