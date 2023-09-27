import { GetSiteHeaderInputPort } from "@/lib/core/port/primary/get-site-header-ports";
import EnvConfigGatewayOutputPort from "@/lib/core/port/secondary/env-config-gateway-output-port";
import GetSiteHeaderUseCase from "@/lib/core/use-case/get-site-header-usecase";
import { BaseFeature } from "@/lib/sdk/ioc-helpers";
import { Container, interfaces } from "inversify";
import { NextApiResponse } from "next";
import GetSiteHeaderController, { GetSiteHeaderControllerParameters } from "../../controller/get-site-header-controller";
import GetSiteHeaderPresenter from "../../presenter/get-site-header-presenter";
import CONTROLLERS from "../ioc-symbols-controllers";
import GATEWAYS from "../ioc-symbols-gateway";
import INPUT_PORT from "../ioc-symbols-input-port";
import USECASE_FACTORY from "../ioc-symbols-usecase-factory";
import type {GetSiteHeaderRequest, GetSiteHeaderResponse, GetSiteHeaderError} from "@/lib/core/usecase-models/get-site-header-usecase-models";
import type {SiteHeaderViewModel} from "@/lib/infrastructure/data/view-model/site-header";

export default class GetSiteHeaderFeature extends BaseFeature<
    GetSiteHeaderControllerParameters,
    GetSiteHeaderRequest,
    GetSiteHeaderResponse,
    GetSiteHeaderError,
    SiteHeaderViewModel>{
    constructor(appContainer: Container) {
        const envConfigGateway: EnvConfigGatewayOutputPort = appContainer.get(GATEWAYS.ENV_CONFIG)
        const symbols = {
            CONTROLLER: CONTROLLERS.GET_SITE_HEADER,
            USECASE_FACTORY: USECASE_FACTORY.GET_SITE_HEADER,
            INPUT_PORT: INPUT_PORT.GET_SITE_HEADER,
        }
        super(
            'GetSiteHeader',
            GetSiteHeaderController,
            GetSiteHeaderUseCase,
            [envConfigGateway],
            GetSiteHeaderPresenter,
            false,
            symbols
        )
    }

    /**
     * Override the base implementation
     */
    load(appContainer: Container) {
    appContainer.bind<GetSiteHeaderInputPort>(INPUT_PORT.GET_SITE_HEADER).to(GetSiteHeaderUseCase).inRequestScope();
    appContainer.bind<GetSiteHeaderController>(CONTROLLERS.GET_SITE_HEADER).to(GetSiteHeaderController);
    appContainer.bind<interfaces.Factory<GetSiteHeaderInputPort>>(USECASE_FACTORY.GET_SITE_HEADER).toFactory<GetSiteHeaderUseCase, [NextApiResponse]>((context: interfaces.Context) =>
        (response: NextApiResponse) => {
            const envConfigGateway: EnvConfigGatewayOutputPort = appContainer.get(GATEWAYS.ENV_CONFIG)
            const presenter = new GetSiteHeaderPresenter(response)
            return new GetSiteHeaderUseCase(presenter, envConfigGateway);
        });
    }
}