import {
    ListRulesForAccountError,
    ListRulesForAccountResponse,
} from '@/lib/core/usecase-models/list-rules-for-account-usecase-models'
import { NextApiResponse } from 'next'
import { RuleViewModel, generateEmptyRuleViewModel } from '@/lib/infrastructure/data/view-model/rule'
import { BaseStreamingPresenter } from '@/lib/sdk/presenter'
import { ListRulesForAccountOutputPort } from '@/lib/core/port/primary/list-rules-for-account-ports'

export default class ListRulesForAccountPresenter extends BaseStreamingPresenter<ListRulesForAccountResponse, ListRulesForAccountError, RuleViewModel> implements ListRulesForAccountOutputPort {
    response: NextApiResponse<any>

    constructor(response: NextApiResponse) {
        super(response)
        this.response = response
    }

    streamResponseModelToViewModel(responseModel: ListRulesForAccountResponse): RuleViewModel {
        const viewModel: RuleViewModel = {
            ...responseModel,
        }
        return viewModel
    }

    streamErrorModelToViewModel(error: ListRulesForAccountError): RuleViewModel {
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
     convertErrorModelToViewModel(errorModel: ListRulesForAccountError): { viewModel: RuleViewModel; status: number; } {
        const viewModel: RuleViewModel = generateEmptyRuleViewModel();
        // gateway errors
        const message = errorModel.message ? errorModel.message.toString() : errorModel.name;
        const name = errorModel.name ? errorModel.name : '';
        viewModel.message = message;
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel
        }
    }
}
