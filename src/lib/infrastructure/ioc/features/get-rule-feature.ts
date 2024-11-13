import RuleGatewayOutputPort from '@/lib/core/port/secondary/rule-gateway-output-port';
import { GetRuleError, GetRuleRequest, GetRuleResponse } from '@/lib/core/usecase-models/get-rule-usecase-models';
import { GetRuleControllerParameters } from '@/lib/infrastructure/controller/get-rule-controller';
import GetRuleController from '@/lib/infrastructure/controller/get-rule-controller';
import { GetRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { BaseFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import GATEWAYS from '@/lib/infrastructure/ioc/ioc-symbols-gateway';
import CONTROLLERS from '@/lib/infrastructure/ioc/ioc-symbols-controllers';
import INPUT_PORT from '@/lib/infrastructure/ioc/ioc-symbols-input-port';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';
import { Container } from 'inversify';

import GetRuleUseCase from '@/lib/core/use-case/get-rule-usecase';

import GetRulePresenter from '@/lib/infrastructure/presenter/get-rule-presenter';

export default class GetRuleFeature extends BaseFeature<
    GetRuleControllerParameters,
    GetRuleRequest,
    GetRuleResponse,
    GetRuleError,
    GetRuleViewModel
> {
    constructor(appContainer: Container) {
        const rucioRuleGateway = appContainer.get<RuleGatewayOutputPort>(GATEWAYS.RULE);

        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.GET_RULE,
            USECASE_FACTORY: USECASE_FACTORY.GET_RULE,
            INPUT_PORT: INPUT_PORT.GET_RULE,
        };
        const useCaseConstructorArgs = [rucioRuleGateway];
        super('GetRule', GetRuleController, GetRuleUseCase, useCaseConstructorArgs, GetRulePresenter, false, symbols);
    }
}
