import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import { UpdateRuleError, UpdateRuleRequest, UpdateRuleResponse } from '@/lib/core/usecase-models/update-rule-usecase-models';
import { UpdateRuleControllerParameters } from '@/lib/infrastructure/controller/update-rule-controller';
import UpdateRuleController from '@/lib/infrastructure/controller/update-rule-controller';
import { UpdateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import UpdateRuleUseCase from '@/lib/core/use-case/update-rule-usecase';

import UpdateRulePresenter from '@/lib/infrastructure/presenter/update-rule-presenter';

export default class UpdateRuleFeature extends BaseFeature<
    UpdateRuleControllerParameters,
    UpdateRuleRequest,
    UpdateRuleResponse,
    UpdateRuleError,
    UpdateRuleViewModel
> {
    constructor(appContainer: Container) {
        const rucioRuleGateway = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.UPDATE_RULE,
            USECASE_FACTORY: USECASE_FACTORY.UPDATE_RULE,
            INPUT_PORT: INPUT_PORT.UPDATE_RULE,
        };
        const useCaseConstructorArgs = [rucioRuleGateway];
        super('UpdateRule', UpdateRuleController, UpdateRuleUseCase, useCaseConstructorArgs, UpdateRulePresenter, false, symbols);
    }
}
