import SubscriptionGatewayOutputPort from '@/lib/core/port/secondary/subscription-gateway-output-port';
import GetSubscriptionUseCase from '@/lib/core/use-case/get-subscription-usecase';
import { GetSubscriptionError, GetSubscriptionRequest, GetSubscriptionResponse } from '@/lib/core/usecase-models/get-subscription-usecase-models';
import { BaseFeature } from '@/lib/sdk/ioc-helpers';
import { Container } from 'inversify';
import GetSubscriptionController, { GetSubscriptionControllerParameters } from '../../controller/get-subscription-controller';
import { SubscriptionViewModel } from '../../data/view-model/subscriptions';
import GetSubscriptionPresenter from '../../presenter/get-subscription-presenter';
import CONTROLLERS from '../ioc-symbols-controllers';
import GATEWAYS from '../ioc-symbols-gateway';
import INPUT_PORT from '../ioc-symbols-input-port';
import USECASE_FACTORY from '../ioc-symbols-usecase-factory';

export default class GetSubscriptionFeature extends BaseFeature<
    GetSubscriptionControllerParameters,
    GetSubscriptionRequest,
    GetSubscriptionResponse,
    GetSubscriptionError,
    SubscriptionViewModel
> {
    constructor(appContainer: Container) {
        const gateway: SubscriptionGatewayOutputPort = appContainer.get(GATEWAYS.SUBSCRIPTION);
        const symbols = {
            CONTROLLER: CONTROLLERS.GET_SUBSCRIPTION,
            USECASE_FACTORY: USECASE_FACTORY.GET_SUBSCRIPTION,
            INPUT_PORT: INPUT_PORT.GET_SUBSCRIPTION,
        };
        super('GetSubscription', GetSubscriptionController, GetSubscriptionUseCase, [gateway], GetSubscriptionPresenter, false, symbols);
    }
}
