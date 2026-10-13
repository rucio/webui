import { BasePresenter } from '@/lib/sdk/presenter';
import { GetAccountQuotasError, GetAccountQuotasResponse } from '@/lib/core/usecase-models/get-account-quotas-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyAccountQuotasViewModel, AccountQuotasViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class GetAccountQuotasPresenter extends BasePresenter<GetAccountQuotasResponse, GetAccountQuotasError, AccountQuotasViewModel> {
    convertResponseModelToViewModel(responseModel: GetAccountQuotasResponse): { viewModel: AccountQuotasViewModel; status: number } {
        return {
            status: 200,
            viewModel: { status: 'success', local: responseModel.local, global: responseModel.global },
        };
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
