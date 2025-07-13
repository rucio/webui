import { ListRulesError, ListRulesResponse } from '@/lib/core/usecase-models/list-rules-usecase-models';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { ListRulesOutputPort } from '@/lib/core/port/primary/list-rules-ports';
import { generateEmptyRuleViewModel, RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';

export default class ListRulesPresenter
    extends BaseStreamingPresenter<ListRulesResponse, ListRulesError, RuleViewModel>
    implements ListRulesOutputPort
{
    streamResponseModelToViewModel(responseModel: ListRulesResponse): RuleViewModel {
        const viewModel: RuleViewModel = {
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListRulesError): RuleViewModel {
        const errorViewModel: RuleViewModel = generateEmptyRuleViewModel();
        errorViewModel.status = 'error';
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }

    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model that represents the error model.
     */
    convertErrorModelToViewModel(errorModel: ListRulesError): { viewModel: RuleViewModel; status: number } {
        const viewModel: RuleViewModel = generateEmptyRuleViewModel();

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
