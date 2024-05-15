import "reflect-metadata";
import StreamGatewayOutputPort from "@/lib/core/port/secondary/stream-gateway-output-port";
import StreamingGateway from "../../sdk/streaming-gateway";
import AccountGatewayOutputPort from "@/lib/core/port/secondary/account-gateway-output-port";
import RucioAccountGateway from "../gateway/account-gateway/account-gateway";
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
import ListDIDParentsFeature from "./features/list-did-parents-feature";
import ReplicaGatewayOutputPort from "@/lib/core/port/secondary/replica-gateway-output-port";
import ReplicaGateway from "../gateway/replica-gateway/replica-gateway";
import ListFileReplicasFeature from "./features/list-file-replicas-feature";
import ListDatasetReplicasFeature from "./features/list-dataset-replicas-feature";
import ListDIDContentsFeature from "./features/list-did-contents-feature";
import GetRSEFeature from "./features/get-rse-feature";
import GetRSEProtocolsFeature from "./features/get-rse-protocols-feature";
import GetRSEAttributesFeature from "./features/get-rse-attributes-feature";
import ListRSEsFeature from "./features/list-rses-feature";
import ListAllRSEsFeature from "./features/list-all-rses-feature";
import GetSiteHeaderFeature from "./features/get-site-header-feature";
import ListSubscriptionRuleStatesFeature from "./features/list-subscription-rule-states-feature";
import RuleGatewayOutputPort from "@/lib/core/port/secondary/rule-gateway-output-port";
import RuleGateway from "../gateway/rule-gateway/rule-gateway";
import ListAccountRSEQuotasFeature from "./features/list-account-rse-quotas-feature";
import GetAccountInfoFeature from "./features/get-account-info-feature";
import UserpassLoginV2Feature from "./features/userpass-login-V2-feature";


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
appContainer.bind<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA).to(ReplicaGateway);
appContainer.bind<RuleGatewayOutputPort>(GATEWAYS.RULE).to(RuleGateway);

// Load Common Features
loadFeaturesSync(appContainer, [
    new GetSiteHeaderFeature(appContainer),
])

// Load Auth Features/Usecases
loadFeaturesSync(appContainer, [
    new LoginConfigFeature(appContainer),
    new UserpassLoginV2Feature(appContainer)
])

// Load Features
loadFeaturesSync(appContainer, [
    new DIDMetaFeature(appContainer),
    new DIDKeyValuePairsDataFeature(appContainer),
    new GetSubscriptionFeature(appContainer),
    new ListDidsFeature(appContainer),
    new ListDIDContentsFeature(appContainer),
    new ListDIDParentsFeature(appContainer),
    new ListDIDRulesFeature(appContainer),
    new ListDatasetReplicasFeature(appContainer),
    new ListFileReplicasFeature(appContainer),
    new ListSubscriptionsFeature(appContainer),
])

// Features: Page RSE
loadFeaturesSync(appContainer, [
    new GetRSEFeature(appContainer),
    new GetRSEProtocolsFeature(appContainer),
    new GetRSEAttributesFeature(appContainer),
])

// Features: List RSE
loadFeaturesSync(appContainer, [
    new ListRSEsFeature(appContainer),
])

// Features: Create Rule
loadFeaturesSync(appContainer, [
    new ListAllRSEsFeature(appContainer),
    new ListAccountRSEQuotasFeature(appContainer),
    new GetAccountInfoFeature(appContainer),
])

//Features: List Subscriptions
loadFeaturesSync(appContainer, [
    new ListSubscriptionRuleStatesFeature(appContainer),
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

// appContainer.bind<GetSiteHeaderInputPort>(INPUT_PORT.GET_SITE_HEADER).to(GetSiteHeaderUseCase).inRequestScope();
// appContainer.bind<GetSiteHeaderControllerParameters>(CONTROLLERS.GET_SITE_HEADER).to(GetSiteHeaderController);
// appContainer.bind<interfaces.Factory<GetSiteHeaderInputPort>>(USECASE_FACTORY.GET_SITE_HEADER).toFactory<GetSiteHeaderUseCase, [NextApiResponse]>((context: interfaces.Context) =>
//     (response: NextApiResponse) => {
//         const envConfigGateway: EnvConfigGatewayOutputPort = appContainer.get(GATEWAYS.ENV_CONFIG)
//         const presenter = new GetSiteHeaderPresenter(response)
//         return new GetSiteHeaderUseCase(presenter, envConfigGateway);
//     }
// );

appContainer.bind<SwitchAccountInputPort>(INPUT_PORT.SWITCH_ACCOUNT).to(SwitchAccountUseCase).inRequestScope();
appContainer.bind<ISwitchAccountController>(CONTROLLERS.SWITCH_ACCOUNT).to(SwitchAccountController);
appContainer.bind<interfaces.Factory<SwitchAccountInputPort>>(USECASE_FACTORY.SWITCH_ACCOUNT).toFactory<SwitchAccountUseCase, [NextApiResponse]>((context: interfaces.Context) =>
    (response: NextApiResponse) => {
        const switchAccountPresenter = new SwitchAccountPresenter(response)
        return new SwitchAccountUseCase(switchAccountPresenter);
    }
);

export default appContainer;