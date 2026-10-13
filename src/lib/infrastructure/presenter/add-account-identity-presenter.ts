import { BasePresenter } from '@/lib/sdk/presenter';
import { AddAccountIdentityError, AddAccountIdentityResponse } from '@/lib/core/usecase-models/add-account-identity-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyAddAccountIdentityViewModel, AddAccountIdentityViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class AddAccountIdentityPresenter extends BasePresenter<
    AddAccountIdentityResponse,
    AddAccountIdentityError,
    AddAccountIdentityViewModel
> {
    convertResponseModelToViewModel(responseModel: AddAccountIdentityResponse): { viewModel: AddAccountIdentityViewModel; status: number } {
        return { status: 200, viewModel: { status: 'success' } };
    }

    convertErrorModelToViewModel(errorModel: AddAccountIdentityError): { viewModel: AddAccountIdentityViewModel; status: number } {
        const viewModel: AddAccountIdentityViewModel = generateEmptyAddAccountIdentityViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'add-account-identity', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
