import {
    ListFileReplicasError,
    ListFileReplicasResponse,
} from '@/lib/core/usecase-models/list-file-replicas-usecase-models'
import { NextApiResponse } from 'next'
import { FileReplicaStateViewModel, generateEmptyFilereplicaStateViewModel } from '@/lib/infrastructure/data/view-model/did'
import { BaseStreamingPresenter } from '@/lib/sdk/presenter'
import { ListFileReplicasOutputPort } from '@/lib/core/port/primary/list-file-replicas-ports'

export default class ListFileReplicasPresenter extends BaseStreamingPresenter<ListFileReplicasResponse, ListFileReplicasError, FileReplicaStateViewModel> implements ListFileReplicasOutputPort {
    response: NextApiResponse<any>

    constructor(response: NextApiResponse) {
        super(response)
        this.response = response
    }

    streamResponseModelToViewModel(responseModel: ListFileReplicasResponse): FileReplicaStateViewModel {
        const viewModel: FileReplicaStateViewModel = {
            ...responseModel,
        }
        return viewModel
    }

    streamErrorModelToViewModel(error: ListFileReplicasError): FileReplicaStateViewModel {
        const errorViewModel: FileReplicaStateViewModel = generateEmptyFilereplicaStateViewModel();
        errorViewModel.status = 'error';
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }

    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model that represents the error model.
     */
     convertErrorModelToViewModel(errorModel: ListFileReplicasError): { viewModel: FileReplicaStateViewModel; status: number; } {
        const viewModel: FileReplicaStateViewModel = generateEmptyFilereplicaStateViewModel();
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
