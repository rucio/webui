import { SubscriptionState } from "@/lib/core/entity/rucio";
import { GetSubscriptionError, GetSubscriptionResponse } from "@/lib/core/usecase-models/get-subscription-usecase-models";
import { BasePresenter } from "@/lib/sdk/presenter";
import { getEmptySubscriptionViewModel, SubscriptionViewModel } from "../data/view-model/subscriptions";

export default class GetSubscriptionPresenter extends BasePresenter<GetSubscriptionResponse, GetSubscriptionError, SubscriptionViewModel> {
    convertResponseModelToViewModel(responseModel: GetSubscriptionResponse): { viewModel: SubscriptionViewModel; status: number; } {
        const viewModel: SubscriptionViewModel = {
            ...responseModel,
            replication_rules: JSON.stringify(responseModel.replication_rules),
        }
        return {
            status: 200,
            viewModel: viewModel
        }
    }
    convertErrorModelToViewModel(errorModel: GetSubscriptionError): { viewModel: SubscriptionViewModel; status: number; } {
        const viewModel: SubscriptionViewModel = getEmptySubscriptionViewModel();
        let status = 400;
        switch (errorModel.error) {
            case 'SUBSCRIPTION_NOT_FOUND':
                status = 404;
                break;
            case 'INVALID_REQUEST':
                status = 400;
                break;
            case 'INVALID_AUTH':
                status = 401;
                break;
            case 'UNKNOWN_ERROR':
                status = 500;
                break;
        }
        return {
            status: status,
            viewModel: viewModel
        }
    }

}