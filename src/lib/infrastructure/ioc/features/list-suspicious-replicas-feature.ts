import ReplicaGatewayOutputPort from '@/lib/core/port/secondary/replica-gateway-output-port';
import {
    ListSuspiciousReplicasError,
    ListSuspiciousReplicasRequest,
    ListSuspiciousReplicasResponse,
} from '@/lib/core/usecase-models/list-suspicious-replicas-usecase-models';
import { ListSuspiciousReplicasControllerParameters } from '@/lib/infrastructure/controller/list-suspicious-replicas-controller';
import ListSuspiciousReplicasController from '@/lib/infrastructure/controller/list-suspicious-replicas-controller';
import { SuspiciousReplicaViewModel } from '@/lib/infrastructure/data/view-model/replica';
import { BaseStreamableFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import ListSuspiciousReplicasUseCase from '@/lib/core/use-case/list-suspicious-replicas-usecase';
import ListSuspiciousReplicasPresenter from '@/lib/infrastructure/presenter/list-suspicious-replicas-presenter';

export default class ListSuspiciousReplicasFeature extends BaseStreamableFeature<
    ListSuspiciousReplicasControllerParameters,
    ListSuspiciousReplicasRequest,
    ListSuspiciousReplicasResponse,
    ListSuspiciousReplicasError,
    SuspiciousReplicaViewModel
> {
    constructor(appContainer: Container) {
        const replicaGateway = appContainer.get<ReplicaGatewayOutputPort>(GATEWAYS.REPLICA);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_SUSPICIOUS_REPLICAS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_SUSPICIOUS_REPLICAS,
            INPUT_PORT: INPUT_PORT.LIST_SUSPICIOUS_REPLICAS,
        };
        const useCaseConstructorArgs = [replicaGateway];
        super(
            'ListSuspiciousReplicas',
            ListSuspiciousReplicasController,
            ListSuspiciousReplicasUseCase,
            useCaseConstructorArgs,
            ListSuspiciousReplicasPresenter,
            false,
            symbols,
        );
    }
}
