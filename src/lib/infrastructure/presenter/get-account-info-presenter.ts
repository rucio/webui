import { BasePresenter } from '@/lib/sdk/presenter';
import { GetAccountInfoError, GetAccountInfoResponse } from '@/lib/core/usecase-models/get-account-info-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyAccountInfoViewModel, AccountInfoViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class GetAccountInfoPresenter extends BasePresenter<GetAccountInfoResponse, GetAccountInfoError, AccountInfoViewModel> {
    convertResponseModelToViewModel(responseModel: GetAccountInfoResponse): { viewModel: AccountInfoViewModel; status: number } {
        const viewModel: AccountInfoViewModel = {
            ...responseModel,
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }

    convertErrorModelToViewModel(errorModel: GetAccountInfoError): { viewModel: AccountInfoViewModel; status: number } {
        const viewModel: AccountInfoViewModel = generateEmptyAccountInfoViewModel();
        // gateway errors
        const errorCode = errorModel.code || 500;
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'read', errorModel.message || errorModel.name);
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
