import { GetSubscriptionByIdError, GetSubscriptionByIdResponse } from '@/lib/core/usecase-models/get-subscription-by-id-usecase-models';
import { BasePresenter } from '@/lib/sdk/presenter';
import { getEmptySubscriptionViewModel, SubscriptionViewModel } from '../data/view-model/subscriptions';

export default class GetSubscriptionByIdPresenter extends BasePresenter<
    GetSubscriptionByIdResponse,
    GetSubscriptionByIdError,
    SubscriptionViewModel
> {
    convertResponseModelToViewModel(responseModel: GetSubscriptionByIdResponse): { viewModel: SubscriptionViewModel; status: number } {
        const viewModel = {
            ...responseModel,
            replication_rules: JSON.stringify(responseModel.replication_rules),
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }

    convertErrorModelToViewModel(errorModel: GetSubscriptionByIdError): { viewModel: SubscriptionViewModel; status: number } {
        const viewModel: SubscriptionViewModel = getEmptySubscriptionViewModel();
        let status = 400;
        switch (errorModel.error) {
            case 'SUBSCRIPTION_NOT_FOUND':
                status = 404;
                break;
            case 'INVALID_AUTH':
                status = 401;
                break;
            case 'INVALID_REQUEST':
            case 'INVALID_ID':
                status = 400;
                break;
            case 'UNKNOWN_ERROR':
                status = 500;
                break;
        }

        return {
            viewModel: viewModel,
            status: status,
        };
    }
}
