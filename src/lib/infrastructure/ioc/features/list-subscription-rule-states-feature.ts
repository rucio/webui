import RSEGatewayOutputPort from "@/lib/core/port/secondary/subscription-gateway-output-port"
import {
    ListSubscriptionRuleStatesError,
    ListSubscriptionRuleStatesRequest,
    ListSubscriptionRuleStatesResponse,
} from "@/lib/core/usecase-models/list-subscription-rule-states-usecase-models"
import { ListSubscriptionRuleStatesControllerParameters } from "@/lib/infrastructure/controller/list-subscription-rule-states-controller"
import ListSubscriptionRuleStatesController from "@/lib/infrastructure/controller/list-subscription-rule-states-controller"
import { SubscriptionRuleStatesViewModel } from "@/lib/infrastructure/data/view-model/subscriptions"
import {
    BaseStreamableFeature,
    IOCSymbols,
} from "@/lib/sdk/ioc-helpers"
import GATEWAYS from "@/lib/infrastructure/ioc/ioc-symbols-gateway"
import CONTROLLERS from "@/lib/infrastructure/ioc/ioc-symbols-controllers"
import INPUT_PORT from "@/lib/infrastructure/ioc/ioc-symbols-input-port"
import USECASE_FACTORY from "@/lib/infrastructure/ioc/ioc-symbols-usecase-factory"
import { Container } from 'inversify'

import ListSubscriptionRuleStatesUseCase from "@/lib/core/use-case/list-subscription-rule-states-usecase"

import ListSubscriptionRuleStatesPresenter from "@/lib/infrastructure/presenter/list-subscription-rule-states-presenter"



export default class ListSubscriptionRuleStatesFeature extends BaseStreamableFeature<
    ListSubscriptionRuleStatesControllerParameters,
    ListSubscriptionRuleStatesRequest,
    ListSubscriptionRuleStatesResponse,
    ListSubscriptionRuleStatesError,
    SubscriptionRuleStatesViewModel
> {
    constructor(appContainer: Container) {
        const subscriptionGateway = appContainer.get<RSEGatewayOutputPort>(GATEWAYS.SUBSCRIPTION)
        
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_SUBSCRIPTION_RULE_STATES,
            USECASE_FACTORY: USECASE_FACTORY.LIST_SUBSCRIPTION_RULE_STATES,
            INPUT_PORT: INPUT_PORT.LIST_SUBSCRIPTION_RULE_STATES,
        }
        const useCaseConstructorArgs = [
            subscriptionGateway,
            
        ]
        super(
            'ListSubscriptionRuleStates',
            ListSubscriptionRuleStatesController,
            ListSubscriptionRuleStatesUseCase,
            useCaseConstructorArgs,
            ListSubscriptionRuleStatesPresenter,
            false,
            symbols
        )
    }
}