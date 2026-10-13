import { BasePresenter } from '@/lib/sdk/presenter';
import { SetAccountLimitError, SetAccountLimitResponse } from '@/lib/core/usecase-models/set-account-limit-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptySetAccountLimitViewModel, SetAccountLimitViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class SetAccountLimitPresenter extends BasePresenter<SetAccountLimitResponse, SetAccountLimitError, SetAccountLimitViewModel> {
    convertResponseModelToViewModel(responseModel: SetAccountLimitResponse): { viewModel: SetAccountLimitViewModel; status: number } {
        return { status: 200, viewModel: { status: 'success' } };
    }

    convertErrorModelToViewModel(errorModel: SetAccountLimitError): { viewModel: SetAccountLimitViewModel; status: number } {
        const viewModel: SetAccountLimitViewModel = generateEmptySetAccountLimitViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'set-account-limit', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
