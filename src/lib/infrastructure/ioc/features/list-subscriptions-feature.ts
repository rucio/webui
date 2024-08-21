import SubscriptionGatewayOutputPort from '@/lib/core/port/secondary/subscription-gateway-output-port';
import ListSubscriptionsUseCase from '@/lib/core/use-case/list-subscriptions-usecase';
import {
    ListSubscriptionsError,
    ListSubscriptionsRequest,
    ListSubscriptionsResponse,
} from '@/lib/core/usecase-models/list-subscriptions-usecase-models';
import { BaseStreamableFeature } from '@/lib/sdk/ioc-helpers';
import { Container } from 'inversify';
import ListSubscriptionsController, { ListSubscriptionsControllerParameters } from '../../controller/list-subscriptions-controller';
import { SubscriptionViewModel } from '../../data/view-model/subscriptions';
import ListSubscriptionsPresenter from '../../presenter/list-subscriptions-presenter';
import CONTROLLERS from '../ioc-symbols-controllers';
import GATEWAYS from '../ioc-symbols-gateway';
import INPUT_PORT from '../ioc-symbols-input-port';
import USECASE_FACTORY from '../ioc-symbols-usecase-factory';

export default class ListSubscriptionsFeature extends BaseStreamableFeature<
    ListSubscriptionsControllerParameters,
    ListSubscriptionsRequest,
    ListSubscriptionsResponse,
    ListSubscriptionsError,
    SubscriptionViewModel
> {
    constructor(appContainer: Container) {
        const subscriptionGateway = appContainer.get<SubscriptionGatewayOutputPort>(GATEWAYS.SUBSCRIPTION);
        const symbols = {
            CONTROLLER: CONTROLLERS.LIST_SUBSCRIPTIONS,
            USECASE_FACTORY: USECASE_FACTORY.LIST_SUBSCRIPTIONS,
            INPUT_PORT: INPUT_PORT.LIST_SUBSCRIPTIONS,
        };
        super(
            'ListSubscriptions',
            ListSubscriptionsController,
            ListSubscriptionsUseCase,
            [subscriptionGateway],
            ListSubscriptionsPresenter,
            false,
            symbols,
        );
    }
}
