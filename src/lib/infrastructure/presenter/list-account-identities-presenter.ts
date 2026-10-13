import { BasePresenter } from '@/lib/sdk/presenter';
import { ListAccountIdentitiesError, ListAccountIdentitiesResponse } from '@/lib/core/usecase-models/list-account-identities-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyAccountIdentitiesViewModel, AccountIdentitiesViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class ListAccountIdentitiesPresenter extends BasePresenter<
    ListAccountIdentitiesResponse,
    ListAccountIdentitiesError,
    AccountIdentitiesViewModel
> {
    convertResponseModelToViewModel(responseModel: ListAccountIdentitiesResponse): { viewModel: AccountIdentitiesViewModel; status: number } {
        return {
            status: 200,
            viewModel: { status: 'success', identities: responseModel.identities },
        };
    }

    convertErrorModelToViewModel(errorModel: ListAccountIdentitiesError): { viewModel: AccountIdentitiesViewModel; status: number } {
        const viewModel: AccountIdentitiesViewModel = generateEmptyAccountIdentitiesViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'read', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
