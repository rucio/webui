import { BasePresenter } from '@/lib/sdk/presenter';
import { DeleteAccountIdentityError, DeleteAccountIdentityResponse } from '@/lib/core/usecase-models/delete-account-identity-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyDeleteAccountIdentityViewModel, DeleteAccountIdentityViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class DeleteAccountIdentityPresenter extends BasePresenter<
    DeleteAccountIdentityResponse,
    DeleteAccountIdentityError,
    DeleteAccountIdentityViewModel
> {
    convertResponseModelToViewModel(responseModel: DeleteAccountIdentityResponse): { viewModel: DeleteAccountIdentityViewModel; status: number } {
        return { status: 200, viewModel: { status: 'success' } };
    }

    convertErrorModelToViewModel(errorModel: DeleteAccountIdentityError): { viewModel: DeleteAccountIdentityViewModel; status: number } {
        const viewModel: DeleteAccountIdentityViewModel = generateEmptyDeleteAccountIdentityViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'delete-account-identity', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
