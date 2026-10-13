import { BasePresenter } from '@/lib/sdk/presenter';
import { UpdateAccountAttributeError, UpdateAccountAttributeResponse } from '@/lib/core/usecase-models/update-account-attribute-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyUpdateAccountAttributeViewModel, UpdateAccountAttributeViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class UpdateAccountAttributePresenter extends BasePresenter<
    UpdateAccountAttributeResponse,
    UpdateAccountAttributeError,
    UpdateAccountAttributeViewModel
> {
    convertResponseModelToViewModel(responseModel: UpdateAccountAttributeResponse): { viewModel: UpdateAccountAttributeViewModel; status: number } {
        return { status: 200, viewModel: { status: 'success' } };
    }

    convertErrorModelToViewModel(errorModel: UpdateAccountAttributeError): { viewModel: UpdateAccountAttributeViewModel; status: number } {
        const viewModel: UpdateAccountAttributeViewModel = generateEmptyUpdateAccountAttributeViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'update-account-attribute', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
