import { Container } from 'inversify';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import {
    GetPandaTaskLinkError,
    GetPandaTaskLinkRequest,
    GetPandaTaskLinkResponse,
} from '@/lib/core/usecase-models/get-panda-task-link-usecase-models';
import GetPandaTaskLinkController, { GetPandaTaskLinkControllerParameters } from '@/lib/infrastructure/controller/get-panda-task-link-controller';
import GetPandaTaskLinkUseCase from '@/lib/core/use-case/get-panda-task-link-usecase';
import GetPandaTaskLinkPresenter from '@/lib/infrastructure/presenter/get-panda-task-link-presenter';
import { PandaTaskLinkViewModel } from '@/lib/infrastructure/data/view-model/panda';
import EnvConfigGatewayOutputPort from '@/lib/core/port/secondary/env-config-gateway-output-port';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export default class GetPandaTaskLinkFeature extends BaseFeature<
    GetPandaTaskLinkControllerParameters,
    GetPandaTaskLinkRequest,
    GetPandaTaskLinkResponse,
    GetPandaTaskLinkError,
    PandaTaskLinkViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const envConfigGateway = appContainer.get<EnvConfigGatewayOutputPort>(GATEWAYS.ENV_CONFIG);
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.GET_PANDA_TASK_LINK,
            USECASE_FACTORY: USECASE_FACTORY.GET_PANDA_TASK_LINK,
            INPUT_PORT: INPUT_PORT.GET_PANDA_TASK_LINK,
        };
        super(
            'GetPandaTaskLink',
            GetPandaTaskLinkController,
            GetPandaTaskLinkUseCase,
            [envConfigGateway],
            GetPandaTaskLinkPresenter,
            false,
            symbols,
            'dids.panda_task',
        );
    }
}
