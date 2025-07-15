import { ListRSEsError, ListRSEsResponse } from '@/lib/core/usecase-models/list-rses-usecase-models';
import { RSEViewModel, generateEmptyRSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { ListRSEsOutputPort } from '@/lib/core/port/primary/list-rses-ports';

export default class ListRSEsPresenter extends BaseStreamingPresenter<ListRSEsResponse, ListRSEsError, RSEViewModel> implements ListRSEsOutputPort {
    streamResponseModelToViewModel(responseModel: ListRSEsResponse): RSEViewModel {
        const viewModel: RSEViewModel = {
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListRSEsError): RSEViewModel {
        const errorViewModel: RSEViewModel = generateEmptyRSEViewModel();
        errorViewModel.status = 'error';
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }

    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model that represents the error model.
     */
    convertErrorModelToViewModel(errorModel: ListRSEsError): { viewModel: RSEViewModel; status: number } {
        const viewModel: RSEViewModel = generateEmptyRSEViewModel();
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
