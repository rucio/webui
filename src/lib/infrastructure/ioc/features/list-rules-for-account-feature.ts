import RSEGatewayOutputPort from "@/lib/core/port/secondary/rule-gateway-output-port"
import {
    ListRulesForAccountError,
    ListRulesForAccountRequest,
    ListRulesForAccountResponse,
} from "@/lib/core/usecase-models/list-rules-for-account-usecase-models"
import { ListRulesForAccountControllerParameters } from "@/lib/infrastructure/controller/list-rules-for-account-controller"
import ListRulesForAccountController from "@/lib/infrastructure/controller/list-rules-for-account-controller"
import { RuleViewModel } from "@/lib/infrastructure/data/view-model/rule"
import {
    BaseStreamableFeature,
    IOCSymbols,
} from "@/lib/sdk/ioc-helpers"
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import INPUT_PORT from "@/lib/infrastructure/ioc/ioc-symbols-input-port"
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory"
import { Container } from 'inversify'

import ListRulesForAccountUseCase from "@/lib/core/use-case/list-rules-for-account-usecase"

import ListRulesForAccountPresenter from "@/lib/infrastructure/presenter/list-rules-for-account-presenter"



export default class ListRulesForAccountFeature extends BaseStreamableFeature<
    ListRulesForAccountControllerParameters,
    ListRulesForAccountRequest,
    ListRulesForAccountResponse,
    ListRulesForAccountError,
    RuleViewModel
> {
    constructor(appContainer: Container) {
        const ruleGateway = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.RULE)
        
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_RULES_FOR_ACCOUNT,
            USECASE_FACTORY: USECASE_FACTORY.LIST_RULES_FOR_ACCOUNT,
            INPUT_PORT: INPUT_PORT.LIST_RULES_FOR_ACCOUNT,
        }
        const useCaseConstructorArgs = [
            ruleGateway,
            
        ]
        super(
            'ListRulesForAccount',
            ListRulesForAccountController,
            ListRulesForAccountUseCase,
            useCaseConstructorArgs,
            ListRulesForAccountPresenter,
            false,
            symbols
        )
    }
}