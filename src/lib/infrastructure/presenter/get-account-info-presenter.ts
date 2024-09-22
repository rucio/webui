import { BasePresenter } from '@/lib/sdk/presenter';
import { GetAccountInfoError, GetAccountInfoResponse } from '@/lib/core/usecase-models/get-account-info-usecase-models';
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
        const message = errorModel.message || errorModel.name;
        viewModel.message = message;
        const errorCode = errorModel.code || 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
