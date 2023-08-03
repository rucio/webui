import "reflect-metadata";
import StreamGatewayOutputPort from "@/lib/core/port/secondary/stream-gateway-output-port";
import StreamingGateway from "../../sdk/streaming-gateway";
import AccountGatewayOutputPort from "@/lib/core/port/secondary/account-gateway-output-port";
import RucioAccountGateway from "../gateway/account-gateway";
import DIDGatewayOutputPort from "@/lib/core/port/secondary/did-gateway-output-port";
import RucioDIDGateway from "../gateway/did-gateway/did-gateway";
import { Container, interfaces } from "inversify";
import { IronSession } from "iron-session";
import { NextApiResponse } from "next";
import CONTROLLERS from "./ioc-symbols-controllers";
import INPUT_PORT from "./ioc-symbols-input-port";
import USECASE_FACTORY from "./ioc-symbols-usecase-factory";
import GATEWAYS from "./ioc-symbols-gateway";
import AuthServerGatewayOutputPort from "@/lib/core/port/secondary/auth-server-gateway-output-port";
import RucioAuthServer from "@/lib/infrastructure/gateway/rucio-auth-server";
import EnvConfigGatewayOutputPort from "@/lib/core/port/secondary/env-config-gateway-output-port";
import EnvConfigGateway from "../gateway/env-config-gateway";
import UserPassLoginInputPort from "@/lib/core/port/primary/userpass-login-input-port";
import UserPassLoginUseCase from "@/lib/core/use-case/userpass-login-usecase";
import UserPassLoginController, {IUserPassLoginController} from "@/lib/infrastructure/controller/userpass-login-controller";
import UserPassLoginPresenter from "@/lib/infrastructure/presenter/usepass-login-presenter";
import SetX509LoginSessionInputPort from "@/lib/core/port/primary/set-x509-login-session-input-port";
import SetX509LoginSessionUseCase from "@/lib/core/use-case/set-x509-login-session-usecase";
import SetX509LoginSessionController, { ISetX509LoginSessionController } from "../controller/set-x509-login-session-controller";
import SetX509LoginSessionPresenter from "../presenter/set-x509-login-session-presenter";
import StreamInputPort from "@/lib/core/port/primary/stream-input-port";
import StreamUseCase from "@/lib/core/use-case/stream-usecase";
import { RSEOld } from "@/lib/core/entity/rucio";
import StreamingController, { IStreamingController } from "../controller/streaming-controller";
import StreamPresenter from "../presenter/stream-presenter";
import SiteHeaderInputPort from "@/lib/core/port/primary/site-header-input-port";
import SiteHeaderUseCase from "@/lib/core/use-case/site-header-usecase";
import SiteHeaderController, { ISiteHeaderController } from "../controller/site-header-controller";
import SiteHeaderPresenter from "../presenter/site-header-presenter";
import SwitchAccountInputPort from "@/lib/core/port/primary/switch-account-input-port";
import SwitchAccountUseCase from "@/lib/core/use-case/switch-account-usecase";
import SwitchAccountController, { ISwitchAccountController } from "../controller/switch-account-controller";
import SwitchAccountPresenter from "../presenter/switch-account-presenter";
import { loadFeaturesSync } from "@/lib/sdk/ioc-helpers";
import ListDidsFeature from "./features/list-dids-feature";
import LoginConfigFeature from "./features/logic-config-feature";
import DIDMetaFeature from "./features/did-meta-feature";
import SubscriptionGatewayOutputPort from "@/lib/core/port/secondary/subscription-gateway-output-port";
import SubscriptionGateway from "../gateway/subscription-gateway/subscription-gateway";
import GetSubscriptionFeature from "./features/get-subscription-feature";
import ListSubscriptionsFeature from "./features/list-subscriptions-feature";
import ListDIDRulesFeature from "./features/list-did-rules-feature";
import DIDKeyValuePairsDataFeature from "./features/get-did-keyvaluepairs-feature";
import RSEGatewayOutputPort from "@/lib/core/port/secondary/rse-gateway-output-port";
import RSEGateway from "../gateway/rse-gateway/rse-gateway";


/**
 * IoC Container configuration for the application.
 */
const appContainer = new Container();
appContainer.bind<AccountGatewayOutputPort>(GATEWAYS.ACCOUNT).to(RucioAccountGateway);
appContainer.bind<AuthServerGatewayOutputPort>(GATEWAYS.AUTH_SERVER).to(RucioAuthServer);
appContainer.bind<DIDGatewayOutputPort>(GATEWAYS.DID).to(RucioDIDGateway);
appContainer.bind<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG).to(EnvConfigGateway);
appContainer.bind<RSEGatewayOutputPort>(GATEWAYS.RSE).to(RSEGateway);
appContainer.bind<StreamGatewayOutputPort>(GATEWAYS.STREAM).to(StreamingGateway).inRequestScope();
appContainer.bind<SubscriptionGatewayOutputPort>(GATEWAYS.SUBSCRIPTION).to(SubscriptionGateway);

loadFeaturesSync(appContainer, [
    new DIDMetaFeature(appContainer),
    new DIDKeyValuePairsDataFeature(appContainer),
    new GetSubscriptionFeature(appContainer),
    new ListDidsFeature(appContainer),
    new ListDIDRulesFeature(appContainer),
    new ListSubscriptionsFeature(appContainer),
    new LoginConfigFeature(appContainer),
])

appContainer.bind<UserPassLoginInputPort>(INPUT_PORT.USERPASS_LOGIN).to(UserPassLoginUseCase).inRequestScope();
appContainer.bind<IUserPassLoginController>(CONTROLLERS.USERPASS_LOGIN).to(UserPassLoginController);
appContainer.bind<interfaces.Factory<UserPassLoginInputPort>>(USECASE_FACTORY.USERPASS_LOGIN).toFactory<UserPassLoginUseCase, [IronSession, NextApiResponse]>((context: interfaces.Context) =>
    (session: IronSession, response: NextApiResponse) => {
        const rucioAuthServer: AuthServerGatewayOutputPort = appContainer.get(GATEWAYS.AUTH_SERVER)
        const rucioAccountGateway: AccountGatewayOutputPort = appContainer.get(GATEWAYS.ACCOUNT)
        return new UserPassLoginUseCase(new UserPassLoginPresenter(session, response), rucioAuthServer, rucioAccountGateway);
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

appContainer.bind<StreamInputPort<RSEOld>>(INPUT_PORT.STREAM).to(StreamUseCase).inRequestScope();
appContainer.bind<IStreamingController>(CONTROLLERS.STREAM).to(StreamingController);
appContainer.bind<interfaces.Factory<StreamInputPort<RSEOld>>>(USECASE_FACTORY.STREAM).toFactory<StreamUseCase, [NextApiResponse]>((context: interfaces.Context) =>
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