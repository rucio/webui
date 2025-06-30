import { GetFTSLinkError, GetFTSLinkRequest, GetFTSLinkResponse } from '@/lib/core/usecase-models/get-fts-link-usecase-models';
import { GetFTSLinkControllerParameters } from '@/lib/infrastructure/controller/get-fts-link-controller';
import GetFTSLinkController from '@/lib/infrastructure/controller/get-fts-link-controller';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import GetFTSLinkUseCase from '@/lib/core/use-case/get-fts-link-usecase';

import GetFTSLinkPresenter from '@/lib/infrastructure/presenter/get-fts-link-presenter';
import RequestGatewayOutputPort from '@/lib/core/port/secondary/request-gateway-output-port';
import { FTSLinkViewModel } from '../../data/view-model/request';

export default class GetFTSLinkFeature extends BaseFeature<
    GetFTSLinkControllerParameters,
    GetFTSLinkRequest,
    GetFTSLinkResponse,
    GetFTSLinkError,
    FTSLinkViewModel
> {
    constructor(appContainer: Container) {
        const requestGateway = appContainer.get<RequestGatewayOutputPort>(GATEWAYS.REQUEST);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.GET_FTS_LINK,
            USECASE_FACTORY: USECASE_FACTORY.GET_FTS_LINK,
            INPUT_PORT: INPUT_PORT.GET_FTS_LINK,
        };
        const useCaseConstructorArgs = [requestGateway];
        super('GetFTSLink', GetFTSLinkController, GetFTSLinkUseCase, useCaseConstructorArgs, GetFTSLinkPresenter, false, symbols);
    }
}
