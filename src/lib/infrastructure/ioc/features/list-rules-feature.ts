import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import { ListRulesError, ListRulesRequest, ListRulesResponse } from '@/lib/core/usecase-models/list-rules-usecase-models';
import { ListRulesControllerParameters } from '@/lib/infrastructure/controller/list-rules-controller';
import ListRulesController from '@/lib/infrastructure/controller/list-rules-controller';
import { BaseStreamableFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import ListRulesUseCase from '@/lib/core/use-case/list-rules-usecase';

import ListRulesPresenter from '@/lib/infrastructure/presenter/list-rules-presenter';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';

export default class ListRulesFeature extends BaseStreamableFeature<
    ListRulesControllerParameters,
    ListRulesRequest,
    ListRulesResponse,
    ListRulesError,
    RuleViewModel
> {
    constructor(appContainer: Container) {
        const ruleGateway = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_RULES,
            USECASE_FACTORY: USECASE_FACTORY.LiST_RULES,
            INPUT_PORT: INPUT_PORT.LIST_RULES,
        };
        const useCaseConstructorArgs = [ruleGateway];
        super('ListRules', ListRulesController, ListRulesUseCase, useCaseConstructorArgs, ListRulesPresenter, false, symbols);
    }
}
