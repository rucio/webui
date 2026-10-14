import { BasePresenter } from '@/lib/sdk/presenter';
import { GetAccountQuotasError, GetAccountQuotasResponse } from '@/lib/core/usecase-models/get-account-quotas-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyAccountQuotasViewModel, AccountQuotasViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class GetAccountQuotasPresenter extends BasePresenter<GetAccountQuotasResponse, GetAccountQuotasError, AccountQuotasViewModel> {
    convertResponseModelToViewModel(responseModel: GetAccountQuotasResponse): { viewModel: AccountQuotasViewModel; status: number } {
        const viewModel: AccountQuotasViewModel = { status: 'success', local: responseModel.local, global: responseModel.global };
        if (responseModel.globalError !== undefined) {
            viewModel.globalError =
                `Rucio could not list the global quotas: ${responseModel.globalError} ` +
                'One of them uses an RSE expression that no longer matches any RSE. Remove it by its expression to list the others again.';
        }
        return { status: 200, viewModel };
    }

    convertErrorModelToViewModel(errorModel: GetAccountQuotasError): { viewModel: AccountQuotasViewModel; status: number } {
        const viewModel: AccountQuotasViewModel = generateEmptyAccountQuotasViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'read', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
