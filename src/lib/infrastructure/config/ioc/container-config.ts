import UserPassLoginInputPort from "@/lib/core/port/primary/userpass-login-input-port";
import { Container, interfaces } from "inversify";
import { NextApiResponse } from "next";
import CONTROLLERS from "./ioc-symbols-controllers";
import INPUT_PORT from "../../../common/ioc/ioc-symbols-input-port";
import OUTPUT_PORT from "../../../common/ioc/ioc-symbols-output-port";
import USECASE_FACTORY from "./ioc-symbols-usecase-factory";
import UserPassLoginUseCase from "@/lib/core/use-case/userpass-login-usecase";
import UserPassLoginController from "@/lib/infrastructure/controller/userpass-login-controller";
import UserPassLoginPresenter from "@/lib/infrastructure/presenter/usepass-login-presenter";
import UserPassLoginOutputPort from "@/lib/core/port/primary/userpass-login-output-port";

const appContainer = new Container();
appContainer.bind<UserPassLoginInputPort>(INPUT_PORT.USERPASS_LOGIN).to(UserPassLoginUseCase);
appContainer.bind<UserPassLoginOutputPort<any>>(OUTPUT_PORT.USERPASS_LOGIN).to(UserPassLoginPresenter);
appContainer.bind<UserPassLoginController>(CONTROLLERS.USERPASS_LOGIN).to(UserPassLoginController);
appContainer.bind<interfaces.Factory<UserPassLoginInputPort>>(USECASE_FACTORY.USERPASS_LOGIN).toFactory<UserPassLoginUseCase, [NextApiResponse]>((context: interfaces.Context) =>
    (response: NextApiResponse) => {
        return new UserPassLoginUseCase(new UserPassLoginPresenter(response));
    }
);

export default appContainer;