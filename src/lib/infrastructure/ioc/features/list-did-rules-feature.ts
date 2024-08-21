import DIDGatewayOutputPort from '@/lib/core/port/secondary/did-gateway-output-port';
import SubscriptionGatewayOutputPort from '@/lib/core/port/secondary/subscription-gateway-output-port';
import ListDIDRulesUseCase from '@/lib/core/use-case/list-did-rules/list-did-rules-usecase';
import { ListDIDRulesError, ListDIDRulesResponse, ListDIDRulesRequest } from '@/lib/core/usecase-models/list-did-rules-usecase-models';
import { BaseStreamableFeature, IOCSymbols } from '@/lib/sdk/ioc-helpers';
import { Container } from 'inversify';
import ListDIDRulesController, { ListDIDRulesControllerParameters } from '../../controller/list-did-rules-controller';
import { DIDRulesViewModel } from '../../data/view-model/did';
import ListDIDRulesPresenter from '../../presenter/list-did-rules-presenter';
import CONTROLLERS from '../ioc-symbols-controllers';
import GATEWAYS from '../ioc-symbols-gateway';
import INPUT_PORT from '../ioc-symbols-input-port';
import USECASE_FACTORY from '../ioc-symbols-usecase-factory';

export default class ListDIDRulesFeature extends BaseStreamableFeature<
    ListDIDRulesControllerParameters,
    ListDIDRulesRequest,
    ListDIDRulesResponse,
    ListDIDRulesError,
    DIDRulesViewModel
> {
    constructor(appContainer: Container) {
        const didGateway = appContainer.get<DIDGatewayOutputPort>(GATEWAYS.DID);
        const subscriptionGateway = appContainer.get<SubscriptionGatewayOutputPort>(GATEWAYS.SUBSCRIPTION);
        const symbols: IOCSymbols = {
            CONTROLLER: CONTROLLERS.LIST_DID_RULES,
            USECASE_FACTORY: USECASE_FACTORY.LIST_DID_RULES,
            INPUT_PORT: INPUT_PORT.LIST_DID_RULES,
        };
        super('ListDIDRules', ListDIDRulesController, ListDIDRulesUseCase, [didGateway, subscriptionGateway], ListDIDRulesPresenter, false, symbols);
    }
}
