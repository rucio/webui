import { GetSubscriptionByIdInputPort } from '@/lib/core/port/primary/get-subscription-by-id-ports';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { inject, injectable } from 'inversify';
import USECASE_FACTORY from '../ioc/ioc-symbols-usecase-factory';
import { GetSubscriptionByIdRequest } from '@/lib/core/usecase-models/get-subscription-by-id-usecase-models';
import { Signal } from '@/lib/sdk/web';

export type GetSubscriptionByIdControllerParameters = TAuthenticatedControllerParameters & {
    id: string;
};

@injectable()
export default class GetSubscriptionByIdController extends BaseController<GetSubscriptionByIdControllerParameters, GetSubscriptionByIdRequest> {
    constructor(
        @inject(USECASE_FACTORY.GET_SUBSCRIPTION_BY_ID) getSubscriptionByIdUseCaseFactory: (response: Signal) => GetSubscriptionByIdInputPort,
    ) {
        super(getSubscriptionByIdUseCaseFactory);
    }

    prepareRequestModel(parameters: GetSubscriptionByIdControllerParameters): GetSubscriptionByIdRequest {
        return {
            id: parameters.id,
            rucioAuthToken: parameters.rucioAuthToken,
        } as GetSubscriptionByIdRequest;
    }
}
