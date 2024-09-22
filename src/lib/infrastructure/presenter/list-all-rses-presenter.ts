import { ListAllRSEsError, ListAllRSEsResponse } from '@/lib/core/usecase-models/list-all-rses-usecase-models';
import { NextApiResponse } from 'next';
import { RSEViewModel, generateEmptyRSEViewModel } from '@/lib/infrastructure/data/view-model/rse';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { ListAllRSEsOutputPort } from '@/lib/core/port/primary/list-all-rses-ports';

export default class ListAllRSEsPresenter
    extends BaseStreamingPresenter<ListAllRSEsResponse, ListAllRSEsError, RSEViewModel>
    implements ListAllRSEsOutputPort
{
    response: NextApiResponse<any>;

    constructor(response: NextApiResponse) {
        super(response);
        this.response = response;
    }

    streamResponseModelToViewModel(responseModel: ListAllRSEsResponse): RSEViewModel {
        const viewModel: RSEViewModel = {
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListAllRSEsError): RSEViewModel {
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
    convertErrorModelToViewModel(errorModel: ListAllRSEsError): { viewModel: RSEViewModel; status: number } {
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
