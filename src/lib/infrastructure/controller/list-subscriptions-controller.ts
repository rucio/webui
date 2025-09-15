import { ListSubscriptionsInputPort } from '@/lib/core/port/primary/list-subscriptions-port';
import { ListSubscriptionsRequest } from '@/lib/core/usecase-models/list-subscriptions-usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { inject, injectable } from 'inversify';
import { Signal } from '@/lib/sdk/web';
import USECASE_FACTORY from '../ioc/ioc-symbols-usecase-factory';

export type ListSubscriptionsControllerParameters = TAuthenticatedControllerParameters & {
    sessionAccount: string;
};

@injectable()
class ListSubscriptionsController extends BaseController<ListSubscriptionsControllerParameters, AuthenticatedRequestModel<ListSubscriptionsRequest>> {
    constructor(@inject(USECASE_FACTORY.LIST_SUBSCRIPTIONS) listSubscriptionsUseCaseFactory: (response: Signal) => ListSubscriptionsInputPort) {
        super(listSubscriptionsUseCaseFactory);
    }
    prepareRequestModel(parameters: ListSubscriptionsControllerParameters): AuthenticatedRequestModel<ListSubscriptionsRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            account: parameters.sessionAccount,
        };
    }
}

export default ListSubscriptionsController;
