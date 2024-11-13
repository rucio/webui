import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import {
    ListRuleReplicaLockStatesError,
    ListRuleReplicaLockStatesRequest,
    ListRuleReplicaLockStatesResponse,
} from '@/lib/core/usecase-models/list-rule-replica-lock-states-usecase-models';
import { ListRuleReplicaLockStatesControllerParameters } from '@/lib/infrastructure/controller/list-rule-replica-lock-states-controller';
import ListRuleReplicaLockStatesController from '@/lib/infrastructure/controller/list-rule-replica-lock-states-controller';
import { ListRuleReplicaLockStatesViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { BaseStreamableFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import ListRuleReplicaLockStatesUseCase from '@/lib/core/use-case/list-rule-replica-lock-states-usecase';

import ListRuleReplicaLockStatesPresenter from '@/lib/infrastructure/presenter/list-rule-replica-lock-states-presenter';

export default class ListRuleReplicaLockStatesFeature extends BaseStreamableFeature<
    ListRuleReplicaLockStatesControllerParameters,
    ListRuleReplicaLockStatesRequest,
    ListRuleReplicaLockStatesResponse,
    ListRuleReplicaLockStatesError,
    ListRuleReplicaLockStatesViewModel
> {
    constructor(appContainer: Container) {
        const rucioRuleGateway = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_RULE_REPLICA_LOCK_STATES,
            USECASE_FACTORY: USECASE_FACTORY.LIST_RULE_REPLICA_LOCK_STATES,
            INPUT_PORT: INPUT_PORT.LIST_RULE_REPLICA_LOCK_STATES,
        };
        const useCaseConstructorArgs = [rucioRuleGateway];
        super(
            'ListRuleReplicaLockStates',
            ListRuleReplicaLockStatesController,
            ListRuleReplicaLockStatesUseCase,
            useCaseConstructorArgs,
            ListRuleReplicaLockStatesPresenter,
            false,
            symbols,
        );
    }
}
