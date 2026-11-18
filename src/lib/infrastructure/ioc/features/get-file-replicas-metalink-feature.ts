import ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';
import {
    GetFileReplicasMetalinkError,
    GetFileReplicasMetalinkRequest,
    GetFileReplicasMetalinkResponse,
} from '@/lib/core/usecase-models/get-file-replicas-metalink-usecase-models';
import { GetFileReplicasMetalinkControllerParameters } from '@/lib/infrastructure/controller/get-file-replicas-metalink-controller';
import GetFileReplicasMetalinkController from '@/lib/infrastructure/controller/get-file-replicas-metalink-controller';
import { FileReplicasMetalinkViewModel } from '@/lib/infrastructure/data/view-model/replica';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import GetFileReplicasMetalinkUseCase from '@/lib/core/use-case/get-file-replicas-metalink-usecase';
import GetFileReplicasMetalinkPresenter from '@/lib/infrastructure/presenter/get-file-replicas-metalink-presenter';

export default class GetFileReplicasMetalinkFeature extends BaseFeature<
    GetFileReplicasMetalinkControllerParameters,
    GetFileReplicasMetalinkRequest,
    GetFileReplicasMetalinkResponse,
    GetFileReplicasMetalinkError,
    FileReplicasMetalinkViewModel
> {
    constructor(appContainer: Container) {
        const replicaGateway = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.GET_FILE_REPLICAS_METALINK,
            USECASE_FACTORY: USECASE_FACTORY.GET_FILE_REPLICAS_METALINK,
            INPUT_PORT: INPUT_PORT.GET_FILE_REPLICAS_METALINK,
        };
        const useCaseConstructorArgs = [replicaGateway];
        super(
            'GetFileReplicasMetalink',
            GetFileReplicasMetalinkController,
            GetFileReplicasMetalinkUseCase,
            useCaseConstructorArgs,
            GetFileReplicasMetalinkPresenter,
            false,
            symbols,
        );
    }
}
