import { ListAccountsError, ListAccountsResponse } from '@/lib/core/usecase-models/list-accounts-usecase-models';
import { AccountListItemViewModel, generateEmptyAccountListItemViewModel } from '@/lib/infrastructure/data/view-model/account';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { ListAccountsOutputPort } from '@/lib/core/port/primary/list-accounts-ports';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';

export default class ListAccountsPresenter
    extends BaseStreamingPresenter<ListAccountsResponse, ListAccountsError, AccountListItemViewModel>
    implements ListAccountsOutputPort
{
    streamResponseModelToViewModel(responseModel: ListAccountsResponse): AccountListItemViewModel {
        return { ...responseModel };
    }

    streamErrorModelToViewModel(error: ListAccountsError): AccountListItemViewModel {
        return this.errorViewModel(error);
    }

    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model and the HTTP status (the error model's code).
     */
    convertErrorModelToViewModel(errorModel: ListAccountsError): { viewModel: AccountListItemViewModel; status: number } {
        return {
            status: errorModel.code ? errorModel.code : 500,
            viewModel: this.errorViewModel(errorModel),
        };
    }

    private errorViewModel(errorModel: ListAccountsError): AccountListItemViewModel {
        const viewModel = generateEmptyAccountListItemViewModel();
        const errorType = toAccountErrorType(errorModel.code ? errorModel.code : 500, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'read', errorModel.message ? errorModel.message.toString() : errorModel.name);
        return viewModel;
    }
}
