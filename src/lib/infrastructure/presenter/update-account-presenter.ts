import { BasePresenter } from '@/lib/sdk/presenter';
import { UpdateAccountError, UpdateAccountResponse } from '@/lib/core/usecase-models/update-account-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyUpdateAccountViewModel, UpdateAccountViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class UpdateAccountPresenter extends BasePresenter<UpdateAccountResponse, UpdateAccountError, UpdateAccountViewModel> {
    convertResponseModelToViewModel(responseModel: UpdateAccountResponse): { viewModel: UpdateAccountViewModel; status: number } {
        return { status: 200, viewModel: { status: 'success' } };
    }

    convertErrorModelToViewModel(errorModel: UpdateAccountError): { viewModel: UpdateAccountViewModel; status: number } {
        const viewModel: UpdateAccountViewModel = generateEmptyUpdateAccountViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'update-account', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
