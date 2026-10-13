import { BasePresenter } from '@/lib/sdk/presenter';
import { ListAccountAttributesError, ListAccountAttributesResponse } from '@/lib/core/usecase-models/list-account-attributes-usecase-models';
import { toAccountErrorMessage, toAccountErrorType } from '@/lib/infrastructure/presenter/utils/account-error-type';
import { generateEmptyAccountAttributesViewModel, AccountAttributesViewModel } from '@/lib/infrastructure/data/view-model/account';

export default class ListAccountAttributesPresenter extends BasePresenter<
    ListAccountAttributesResponse,
    ListAccountAttributesError,
    AccountAttributesViewModel
> {
    convertResponseModelToViewModel(responseModel: ListAccountAttributesResponse): { viewModel: AccountAttributesViewModel; status: number } {
        return {
            status: 200,
            viewModel: { status: 'success', attributes: responseModel.attributes },
        };
    }

    convertErrorModelToViewModel(errorModel: ListAccountAttributesError): { viewModel: AccountAttributesViewModel; status: number } {
        const viewModel: AccountAttributesViewModel = generateEmptyAccountAttributesViewModel();
        const errorCode = errorModel.code || 500;
        // name carries Rucio's ExceptionClass via handleCommonGatewayErrors
        const errorType = toAccountErrorType(errorCode, errorModel.name);
        viewModel.errorType = errorType;
        viewModel.message = toAccountErrorMessage(errorType, 'read', errorModel.message || errorModel.name);
        return { status: errorCode, viewModel };
    }
}
