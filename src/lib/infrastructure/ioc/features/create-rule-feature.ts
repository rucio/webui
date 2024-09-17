import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import { CreateRuleError, CreateRuleRequest, CreateRuleResponse } from '@/lib/core/usecase-models/create-rule-usecase-models';
import { CreateRuleControllerParameters } from '@/lib/infrastructure/controller/create-rule-controller';
import CreateRuleController from '@/lib/infrastructure/controller/create-rule-controller';
import { CreateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import CreateRuleUseCase from '@/lib/core/use-case/create-rule-usecase';

import CreateRulePresenter from '@/lib/infrastructure/presenter/create-rule-presenter';

export default class CreateRuleFeature extends BaseFeature<
    CreateRuleControllerParameters,
    CreateRuleRequest,
    CreateRuleResponse,
    CreateRuleError,
    CreateRuleViewModel
> {
    constructor(appContainer: Container) {
        const ruleGateway = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.CREATE_RULE,
            USECASE_FACTORY: USECASE_FACTORY.CREATE_RULE,
            INPUT_PORT: INPUT_PORT.CREATE_RULE,
        };
        const useCaseConstructorArgs = [ruleGateway];
        super('CreateRule', CreateRuleController, CreateRuleUseCase, useCaseConstructorArgs, CreateRulePresenter, false, symbols);
    }
}
