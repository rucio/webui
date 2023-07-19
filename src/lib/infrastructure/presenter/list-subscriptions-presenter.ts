import { ListSubscriptionsError, ListSubscriptionsResponse } from "@/lib/core/usecase-models/list-subscriptions-usecase-models";
import { BaseStreamingPresenter } from "@/lib/sdk/presenter";
import { NextApiResponse } from "next";
import { getEmptySubscriptionViewModel, SubscriptionViewModel } from "../data/view-model/subscriptions";

export default class ListSubscriptionsPresenter extends BaseStreamingPresenter<ListSubscriptionsResponse, ListSubscriptionsError, SubscriptionViewModel> {
    response: NextApiResponse<any>;

    constructor(response: NextApiResponse) {
        super(response);
        this.response = response;
    }
    
    convertResponseModelToViewModel(responseModel: ListSubscriptionsResponse): SubscriptionViewModel {
        const viewModel: SubscriptionViewModel = {
            ...responseModel,
            replication_rules: JSON.stringify(responseModel.replication_rules),
        };
        return viewModel;
    }

    convertErrorModelToViewModel(errorModel: ListSubscriptionsError): { status: number; viewModel: SubscriptionViewModel; } {
        const viewModel: SubscriptionViewModel = getEmptySubscriptionViewModel();
        const error = errorModel.error;
        // custom usecase errors
        if(error === 'INVALID_ACCOUNT') {
            viewModel.message = errorModel.message;
            return {
                status: 400,
                viewModel: viewModel
            }
        }
        // gateway errors
        const message = errorModel.message ? errorModel.message.toString() : errorModel.error;
        const name = errorModel.name ? errorModel.name : '';
        viewModel.message = message;
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel
        }
    }
}