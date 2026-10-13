import { BasePresenter } from '@/lib/sdk/presenter';
import { DeleteAccountError, DeleteAccountResponse } from '@/lib/core/usecase-models/delete-account-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyDeleteAccountViewModel, DeleteAccountViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class DeleteAccountPresenter extends BasePresenter<DeleteAccountResponse, DeleteAccountError, DeleteAccountViewModel> {
    convertResponseModelToViewModel(responseModel: DeleteAccountResponse): { viewModel: DeleteAccountViewModel; status: number } {
        return { status: 200, viewModel: { status: 'success' } };
    }

    convertErrorModelToViewModel(errorModel: DeleteAccountError): { viewModel: DeleteAccountViewModel; status: number } {
        const viewModel: DeleteAccountViewModel = generateEmptyDeleteAccountViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'delete-account', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
