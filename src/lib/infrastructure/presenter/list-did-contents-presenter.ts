import {
    ListDIDContentsError,
    ListDIDContentsResponse,
} from '@/lib/core/usecase-models/list-did-contents-usecase-models'
import { NextApiResponse } from 'next'
import { DIDViewModel, generateEmptyDIDViewModel } from '@/lib/infrastructure/data/view-model/did'
import { BaseStreamingPresenter } from '@/lib/sdk/presenter'
import { ListDIDContentsOutputPort } from '@/lib/core/port/primary/list-did-contents-ports'

export default class ListDIDContentsPresenter extends BaseStreamingPresenter<ListDIDContentsResponse, ListDIDContentsError, DIDViewModel> implements ListDIDContentsOutputPort {
    response: NextApiResponse<any>

    constructor(response: NextApiResponse) {
        super(response)
        this.response = response
    }

    streamResponseModelToViewModel(responseModel: ListDIDContentsResponse): DIDViewModel {
        const viewModel: DIDViewModel = {
            ...responseModel,
        }
        return viewModel
    }

    streamErrorModelToViewModel(error: ListDIDContentsError): DIDViewModel {
        const errorViewModel: DIDViewModel = generateEmptyDIDViewModel();
        errorViewModel.status = 'error';
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }

    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model that represents the error model.
     */
     convertErrorModelToViewModel(errorModel: ListDIDContentsError): { viewModel: DIDViewModel; status: number; } {
        const viewModel: DIDViewModel = generateEmptyDIDViewModel();
        // gateway errors
        const message = errorModel.message ? errorModel.message.toString() : errorModel.name;
        const name = errorModel.name ? errorModel.name : '';
        viewModel.message = message;
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel
        }
    }
}
