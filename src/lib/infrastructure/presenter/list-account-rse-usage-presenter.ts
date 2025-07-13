import { ListAccountRSEUsageError, ListAccountRSEUsageResponse } from '@/lib/core/usecase-models/list-account-rse-usage-usecase-models';
import { RSEAccountUsageViewModel, generateEmptyRSEAccountUsageViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { ListAccountRSEUsageOutputPort } from '@/lib/core/port/primary/list-account-rse-usage-ports';

export default class ListAccountRSEUsagePresenter
    extends BaseStreamingPresenter<ListAccountRSEUsageResponse, ListAccountRSEUsageError, RSEAccountUsageViewModel>
    implements ListAccountRSEUsageOutputPort
{
    streamResponseModelToViewModel(responseModel: ListAccountRSEUsageResponse): RSEAccountUsageViewModel {
        const viewModel: RSEAccountUsageViewModel = {
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListAccountRSEUsageError): RSEAccountUsageViewModel {
        const errorViewModel: RSEAccountUsageViewModel = generateEmptyRSEAccountUsageViewModel();
        errorViewModel.status = 'error';
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }

    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model that represents the error model.
     */
    convertErrorModelToViewModel(errorModel: ListAccountRSEUsageError): { viewModel: RSEAccountUsageViewModel; status: number } {
        const viewModel: RSEAccountUsageViewModel = generateEmptyRSEAccountUsageViewModel();

        // gateway errors
        const message = errorModel.message ? errorModel.message.toString() : errorModel.name;
        const name = errorModel.name ? errorModel.name : '';
        viewModel.message = message;
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
