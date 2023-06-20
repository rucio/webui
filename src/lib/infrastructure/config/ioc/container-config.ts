import "reflect-metadata";
import StreamGatewayOutputPort from "@/lib/core/port/secondary/stream-gateway-output-port";
import StreamingGateway from "../../../sdk/streaming-gateway";
import AccountGatewayOutputPort from "@/lib/core/port/secondary/account-gateway-output-port";
import RucioAccountGateway from "../../gateway/account-gateway";
import DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";
import RucioDIDGateway from "../../gateway/did-gateway/did-gateway";
import { Container, interfaces } from "inversify";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";
import CONTROLLERS from "./ioc-symbols-controllers";
import INPUT_PORT from "../../../common/ioc/ioc-symbols-input-port";
import USECASE_FACTORY from "./ioc-symbols-usecase-factory";
import GATEWAYS from "./ioc-symbols-gateway";
import AuthServerGatewayOutputPort from "@/lib/core/port/secondary/auth-server-gateway-output-port";
import RucioAuthServer from "@/lib/infrastructure/gateway/rucio-auth-server";
import EnvConfigGatewayOutputPort from "@/lib/core/port/secondary/env-config-gateway-output-port";
import EnvConfigGateway from "../../gateway/env-config-gateway";
import UserPassLoginInputPort from "@/lib/core/port/primary/userpass-login-input-port";
import UserPassLoginUseCase from "@/lib/core/use-case/userpass-login-usecase";
import UserPassLoginController, {IUserPassLoginController} from "@/lib/infrastructure/controller/userpass-login-controller";
import UserPassLoginPresenter from "@/lib/infrastructure/presenter/usepass-login-presenter";
import LoginConfigInputPort from "@/lib/core/port/primary/login-config-input-port";
import LoginConfigUseCase from "@/lib/core/use-case/login-config-usecase";
import LoginConfigPresenter from "@/lib/infrastructure/presenter/login-config-presenter";
import LoginConfigController, {ILoginConfigController} from "@/lib/infrastructure/controller/login-config-controller";
import SetX509LoginSessionInputPort from "@/lib/core/port/primary/set-x509-login-session-input-port";
import SetX509LoginSessionUseCase from "@/lib/core/use-case/set-x509-login-session-usecase";
import SetX509LoginSessionController, { ISetX509LoginSessionController } from "../../controller/set-x509-login-session-controller";
import SetX509LoginSessionPresenter from "../../presenter/set-x509-login-session-presenter";
import StreamInputPort from "@/lib/core/port/primary/stream-input-port";
import StreamUseCase from "@/lib/core/use-case/stream-usecase";
import { RSE } from "@/lib/core/entity/rucio";
import StreamingController, { IStreamingController } from "../../controller/streaming-controller";
import StreamPresenter from "../../presenter/stream-presenter";
import SiteHeaderInputPort from "@/lib/core/port/primary/site-header-input-port";
import SiteHeaderUseCase from "@/lib/core/use-case/site-header-usecase";
import SiteHeaderController, { ISiteHeaderController } from "../../controller/site-header-controller";
import SiteHeaderPresenter from "../../presenter/site-header-presenter";
import SwitchAccountInputPort from "@/lib/core/port/primary/switch-account-input-port";
import SwitchAccountUseCase from "@/lib/core/use-case/switch-account-usecase";
import SwitchAccountController, { ISwitchAccountController } from "../../controller/switch-account-controller";
import SwitchAccountPresenter from "../../presenter/switch-account-presenter";
import { ListDIDsInputPort } from "@/lib/core/port/primary/list-dids-ports";
import ListDIDsUseCase from "@/lib/core/use-case/list-dids-usecase";
import ListDIDsController, { ListDIDsControllerParameters } from "../../controller/list-dids-controller";
import ListDIDsPresenter from "../../presenter/list-dids-presenter";
import { ListDIDsRequest } from "@/lib/core/usecase-models/list-dids-usecase-models";
import { BaseController } from "@/lib/sdk/controller";


/**
 * IoC Container configuration for the application.
 */
const appContainer = new Container();

appContainer.bind<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT).to(RucioAccountGateway);
appContainer.bind<AuthServerGatewayOutputPort>(GATEWAYS.AUTH_SERVER).to(RucioAuthServer);
appContainer.bind<DIDGatewayOutputPort>(GATEWAYS.DID).to(RucioDIDGateway);
appContainer.bind<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG).to(EnvConfigGateway);
appContainer.bind<StreamGatewayOutputPort>(GATEWAYS.STREAM).to(StreamingGateway).inRequestScope();

appContainer.bind<UserPassLoginInputPort>(INPUT_PORT.USERPASS_LOGIN).to(UserPassLoginUseCase).inRequestScope();
appContainer.bind<IUserPassLoginController>(CONTROLLERS.USERPASS_LOGIN).to(UserPassLoginController);
appContainer.bind<interfaces.Factory<UserPassLoginInputPort>>(USECASE_FACTORY.USERPASS_LOGIN).toFactory<UserPassLoginUseCase, [IronSession, NextApiResponse]>((context: interfaces.Context) =>
    (session: IronSession, response: NextApiResponse) => {
        const rucioAuthServer: AuthServerGatewayOutputPort = appContainer.get(GATEWAYS.AUTH_SERVER)
        const rucioAccountGateway: AccountGatewayOutputPort = appContainer.get(GATEWAYS.ACCOUNT)
        return new UserPassLoginUseCase(new UserPassLoginPresenter(session, response), rucioAuthServer, rucioAccountGateway);
    }
);

appContainer.bind<ListDIDsInputPort>(INPUT_PORT.LIST_DIDS).to(ListDIDsUseCase).inRequestScope();
appContainer.bind<BaseController<ListDIDsControllerParameters ,ListDIDsRequest>>(CONTROLLERS.LIST_DIDS).to(ListDIDsController);
appContainer.bind<interfaces.Factory<ListDIDsInputPort>>(USECASE_FACTORY.LIST_DIDS).toFactory<ListDIDsUseCase, [NextApiResponse]>((context: interfaces.Context) =>
    (response: NextApiResponse) => {
        const rucioDIDGateway: DIDGatewayOutputPort = appContainer.get(GATEWAYS.DID)
        return new ListDIDsUseCase(new ListDIDsPresenter(response), rucioDIDGateway);
    }
);

appContainer.bind<LoginConfigInputPort>(INPUT_PORT.LOGIN_CONFIG).to(LoginConfigUseCase).inRequestScope();
appContainer.bind<ILoginConfigController>(CONTROLLERS.LOGIN_CONFIG).to(LoginConfigController);
appContainer.bind<interfaces.Factory<LoginConfigInputPort>>(USECASE_FACTORY.LOGIN_CONFIG).toFactory<LoginConfigUseCase, [IronSession, NextApiResponse]>((context: interfaces.Context) =>
    (session: IronSession, response: NextApiResponse) => {
        const envConfigGateway: EnvConfigGatewayOutputPort = appContainer.get(GATEWAYS.ENV_CONFIG)
        return new LoginConfigUseCase(new LoginConfigPresenter(session, response), envConfigGateway);
    }
);

appContainer.bind<SetX509LoginSessionInputPort>(INPUT_PORT.SET_X509_LOGIN_SESSION).to(SetX509LoginSessionUseCase).inRequestScope();
appContainer.bind<ISetX509LoginSessionController>(CONTROLLERS.SET_X509_LOGIN_SESSION).to(SetX509LoginSessionController);
appContainer.bind<interfaces.Factory<SetX509LoginSessionInputPort>>(USECASE_FACTORY.SET_X509_LOGIN_SESSION).toFactory<SetX509LoginSessionUseCase, [IronSession, NextApiResponse]>((context: interfaces.Context) =>
    (session: IronSession, response: NextApiResponse) => {
        const envConfigGateway: EnvConfigGatewayOutputPort = appContainer.get(GATEWAYS.ENV_CONFIG)
        const rucioAccountGateway: AccountGatewayOutputPort = appContainer.get(GATEWAYS.ACCOUNT)
        return new SetX509LoginSessionUseCase(new SetX509LoginSessionPresenter(session, response), envConfigGateway, rucioAccountGateway);
    }
);

appContainer.bind<StreamInputPort<RSE>>(INPUT_PORT.STREAM).to(StreamUseCase).inRequestScope();
appContainer.bind<IStreamingController>(CONTROLLERS.STREAM).to(StreamingController);
appContainer.bind<interfaces.Factory<StreamInputPort<RSE>>>(USECASE_FACTORY.STREAM).toFactory<StreamUseCase, [NextApiResponse]>((context: interfaces.Context) =>
    (response: NextApiResponse) => {
        const streamingGateway: StreamGatewayOutputPort = appContainer.get(GATEWAYS.STREAM)
        return new StreamUseCase(new StreamPresenter(response), streamingGateway);
    }
);

appContainer.bind<SiteHeaderInputPort>(INPUT_PORT.SITE_HEADER).to(SiteHeaderUseCase).inRequestScope();
appContainer.bind<ISiteHeaderController>(CONTROLLERS.SITE_HEADER).to(SiteHeaderController);
appContainer.bind<interfaces.Factory<SiteHeaderInputPort>>(USECASE_FACTORY.SITE_HEADER).toFactory<SiteHeaderUseCase, [NextApiResponse]>((context: interfaces.Context) =>
    (response: NextApiResponse) => {
        const envConfigGateway: EnvConfigGatewayOutputPort = appContainer.get(GATEWAYS.ENV_CONFIG)
        const presenter = new SiteHeaderPresenter(response)
        return new SiteHeaderUseCase(presenter, envConfigGateway);
    }
);

appContainer.bind<SwitchAccountInputPort>(INPUT_PORT.SWITCH_ACCOUNT).to(SwitchAccountUseCase).inRequestScope();
appContainer.bind<ISwitchAccountController>(CONTROLLERS.SWITCH_ACCOUNT).to(SwitchAccountController);
appContainer.bind<interfaces.Factory<SwitchAccountInputPort>>(USECASE_FACTORY.SWITCH_ACCOUNT).toFactory<SwitchAccountUseCase, [NextApiResponse]>((context: interfaces.Context) =>
    (response: NextApiResponse) => {
        const switchAccountPresenter = new SwitchAccountPresenter(response)
        return new SwitchAccountUseCase(switchAccountPresenter);
    }
);

export default appContainer;