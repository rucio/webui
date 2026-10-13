import { BasePresenter } from '@/lib/sdk/presenter';
import { AddAccountAttributeError, AddAccountAttributeResponse } from '@/lib/core/usecase-models/add-account-attribute-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyAddAccountAttributeViewModel, AddAccountAttributeViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class AddAccountAttributePresenter extends BasePresenter<
    AddAccountAttributeResponse,
    AddAccountAttributeError,
    AddAccountAttributeViewModel
> {
    convertResponseModelToViewModel(responseModel: AddAccountAttributeResponse): { viewModel: AddAccountAttributeViewModel; status: number } {
        return { status: 200, viewModel: { status: 'success' } };
    }

    convertErrorModelToViewModel(errorModel: AddAccountAttributeError): { viewModel: AddAccountAttributeViewModel; status: number } {
        const viewModel: AddAccountAttributeViewModel = generateEmptyAddAccountAttributeViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'add-account-attribute', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
