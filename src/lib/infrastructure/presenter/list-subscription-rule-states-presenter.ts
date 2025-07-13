import {
    ListSubscriptionRuleStatesError,
    ListSubscriptionRuleStatesResponse,
} from '@/lib/core/usecase-models/list-subscription-rule-states-usecase-models';
import { SubscriptionRuleStatesViewModel, generateEmptySubscriptionRuleStatesViewModel } from '@/lib/infrastructure/data/view-model/subscriptions';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { ListSubscriptionRuleStatesOutputPort } from '@/lib/core/port/primary/list-subscription-rule-states-ports';

export default class ListSubscriptionRuleStatesPresenter
    extends BaseStreamingPresenter<ListSubscriptionRuleStatesResponse, ListSubscriptionRuleStatesError, SubscriptionRuleStatesViewModel>
    implements ListSubscriptionRuleStatesOutputPort
{
    streamResponseModelToViewModel(responseModel: ListSubscriptionRuleStatesResponse): SubscriptionRuleStatesViewModel {
        const viewModel: SubscriptionRuleStatesViewModel = {
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListSubscriptionRuleStatesError): SubscriptionRuleStatesViewModel {
        const errorViewModel: SubscriptionRuleStatesViewModel = generateEmptySubscriptionRuleStatesViewModel();
        // TODO: add error handling
        errorViewModel.status = 'error';
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }

    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model that represents the error model.
     */
    convertErrorModelToViewModel(errorModel: ListSubscriptionRuleStatesError): { viewModel: SubscriptionRuleStatesViewModel; status: number } {
        const viewModel: SubscriptionRuleStatesViewModel = generateEmptySubscriptionRuleStatesViewModel();

        // gateway errors
        const message = errorModel.message ? errorModel.message.toString() : errorModel.name;
        const name = errorModel.name ? errorModel.name : '';
        viewModel.message = message;
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
