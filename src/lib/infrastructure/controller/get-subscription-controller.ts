import { GetSubscriptionInputPort } from '@/lib/core/port/primary/get-subscription-ports';
import { GetSubscriptionRequest } from '@/lib/core/usecase-models/get-subscription-usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { inject, injectable } from 'inversify';
import { Signal } from '@/lib/sdk/web';
import USECASE_FACTORY from '../ioc/ioc-symbols-usecase-factory';

export type GetSubscriptionControllerParameters = TAuthenticatedControllerParameters & {
    name: string;
    sessionAccount: string;
};

@injectable()
export default class GetSubscriptionController extends BaseController<GetSubscriptionControllerParameters, GetSubscriptionRequest> {
    constructor(@inject(USECASE_FACTORY.GET_SUBSCRIPTION) getSubscriptionUseCaseFactory: (response: Signal) => GetSubscriptionInputPort) {
        super(getSubscriptionUseCaseFactory);
    }

    prepareRequestModel(parameters: GetSubscriptionControllerParameters): GetSubscriptionRequest {
        return {
            name: parameters.name,
            account: parameters.sessionAccount,
            rucioAuthToken: parameters.rucioAuthToken,
        } as GetSubscriptionRequest;
    }
}
