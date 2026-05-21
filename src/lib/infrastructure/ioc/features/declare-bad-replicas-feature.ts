import ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';
import {
    DeclareBadReplicasError,
    DeclareBadReplicasRequest,
    DeclareBadReplicasResponse,
} from '@/lib/core/usecase-models/declare-bad-replicas-usecase-models';
import { DeclareBadReplicasControllerParameters } from '@/lib/infrastructure/controller/declare-bad-replicas-controller';
import DeclareBadReplicasController from '@/lib/infrastructure/controller/declare-bad-replicas-controller';
import { DeclareBadReplicasViewModel } from '@/lib/infrastructure/data/view-model/replica';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import DeclareBadReplicasUseCase from '@/lib/core/use-case/declare-bad-replicas-usecase';
import DeclareBadReplicasPresenter from '@/lib/infrastructure/presenter/declare-bad-replicas-presenter';

export default class DeclareBadReplicasFeature extends BaseFeature<
    DeclareBadReplicasControllerParameters,
    DeclareBadReplicasRequest,
    DeclareBadReplicasResponse,
    DeclareBadReplicasError,
    DeclareBadReplicasViewModel
> {
    constructor(appContainer: Container) {
        const replicaGateway = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.DECLARE_BAD_REPLICAS,
            USECASE_FACTORY: USECASE_FACTORY.DECLARE_BAD_REPLICAS,
            INPUT_PORT: INPUT_PORT.DECLARE_BAD_REPLICAS,
        };
        const useCaseConstructorArgs = [replicaGateway];
        super(
            'DeclareBadReplicas',
            DeclareBadReplicasController,
            DeclareBadReplicasUseCase,
            useCaseConstructorArgs,
            DeclareBadReplicasPresenter,
            false,
            symbols,
        );
    }
}
