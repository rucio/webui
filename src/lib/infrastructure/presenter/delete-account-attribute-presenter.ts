import { BasePresenter } from '@/lib/sdk/presenter';
import { DeleteAccountAttributeError, DeleteAccountAttributeResponse } from '@/lib/core/usecase-models/delete-account-attribute-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyDeleteAccountAttributeViewModel, DeleteAccountAttributeViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class DeleteAccountAttributePresenter extends BasePresenter<
    DeleteAccountAttributeResponse,
    DeleteAccountAttributeError,
    DeleteAccountAttributeViewModel
> {
    convertResponseModelToViewModel(responseModel: DeleteAccountAttributeResponse): { viewModel: DeleteAccountAttributeViewModel; status: number } {
        return { status: 200, viewModel: { status: 'success' } };
    }

    convertErrorModelToViewModel(errorModel: DeleteAccountAttributeError): { viewModel: DeleteAccountAttributeViewModel; status: number } {
        const viewModel: DeleteAccountAttributeViewModel = generateEmptyDeleteAccountAttributeViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'delete-account-attribute', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
