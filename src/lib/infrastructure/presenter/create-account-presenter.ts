import { BasePresenter } from '@/lib/sdk/presenter';
import { CreateAccountError, CreateAccountResponse } from '@/lib/core/usecase-models/create-account-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyCreateAccountViewModel, CreateAccountViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class CreateAccountPresenter extends BasePresenter<CreateAccountResponse, CreateAccountError, CreateAccountViewModel> {
    convertResponseModelToViewModel(responseModel: CreateAccountResponse): { viewModel: CreateAccountViewModel; status: number } {
        return { status: 200, viewModel: { status: 'success', account: responseModel.account } };
    }

    convertErrorModelToViewModel(errorModel: CreateAccountError): { viewModel: CreateAccountViewModel; status: number } {
        const viewModel: CreateAccountViewModel = generateEmptyCreateAccountViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'create-account', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
