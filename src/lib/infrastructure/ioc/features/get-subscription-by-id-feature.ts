import { BaseFeature } from '@/lib/sdk/ioc-helpers';
import GetSubscriptionByIdController, { GetSubscriptionByIdControllerParameters } from '../../controller/get-subscription-by-id-controller';
import {
    GetSubscriptionByIdError,
    GetSubscriptionByIdRequest,
    GetSubscriptionByIdResponse,
} from '@/lib/core/usecase-models/get-subscription-by-id-usecase-models';
import { SubscriptionViewModel } from '../../data/view-model/subscriptions';
import { FeatureKey } from '@/lib/core/entity/feature-config';
import { Container } from 'inversify';
import SubscriptionGateway from '../../gateway/subscription-gateway/subscription-gateway';
import CONTROLLERS from '../ioc-symbols-controllers';
import GATEWAYS from '../ioc-symbols-gateway';
import USECASE_FACTORY from '../ioc-symbols-usecase-factory';
import INPUT_PORT from '../ioc-symbols-input-port';
import GetSubscriptionByIdUseCase from '@/lib/core/use-case/get-subscription-by-id-usecase';
import GetSubscriptionByIdPresenter from '../../presenter/get-subscription-by-id-presenter';

export default class GetSubscriptionByIdFeature extends BaseFeature<
    GetSubscriptionByIdControllerParameters,
    GetSubscriptionByIdRequest,
    GetSubscriptionByIdResponse,
    GetSubscriptionByIdError,
    SubscriptionViewModel,
    FeatureKey
> {
    constructor(appContainer: Container) {
        const gateway: SubscriptionGateway = appContainer.get(GATEWAYS.SUBSCRIPTION);
        const symbols = {
            CONTROLLER: CONTROLLERS.GET_SUBSCRIPTION_BY_ID,
            USECASE_FACTORY: USECASE_FACTORY.GET_SUBSCRIPTION_BY_ID,
            INPUT_PORT: INPUT_PORT.GET_SUBSCRIPTION_BY_ID,
        };
        super(
            'GetSubscriptionByIdFeature',
            GetSubscriptionByIdController,
            GetSubscriptionByIdUseCase,
            [gateway],
            GetSubscriptionByIdPresenter,
            false,
            symbols,
            'subscriptions',
        );
    }
}
