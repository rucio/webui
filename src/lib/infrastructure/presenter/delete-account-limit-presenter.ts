import { BasePresenter } from '@/lib/sdk/presenter';
import { DeleteAccountLimitError, DeleteAccountLimitResponse } from '@/lib/core/usecase-models/delete-account-limit-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyDeleteAccountLimitViewModel, DeleteAccountLimitViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class DeleteAccountLimitPresenter extends BasePresenter<
    DeleteAccountLimitResponse,
    DeleteAccountLimitError,
    DeleteAccountLimitViewModel
> {
    convertResponseModelToViewModel(responseModel: DeleteAccountLimitResponse): { viewModel: DeleteAccountLimitViewModel; status: number } {
        return { status: 200, viewModel: { status: 'success' } };
    }

    convertErrorModelToViewModel(errorModel: DeleteAccountLimitError): { viewModel: DeleteAccountLimitViewModel; status: number } {
        const viewModel: DeleteAccountLimitViewModel = generateEmptyDeleteAccountLimitViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'delete-account-limit', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
