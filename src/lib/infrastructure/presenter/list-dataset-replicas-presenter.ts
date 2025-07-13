import { ListDatasetReplicasError, ListDatasetReplicasResponse } from '@/lib/core/usecase-models/list-dataset-replicas-usecase-models';
import { DIDDatasetReplicasViewModel, generateEmptyDIDDatasetReplicasViewModel } from '@/lib/infrastructure/data/view-model/did';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { ListDatasetReplicasOutputPort } from '@/lib/core/port/primary/list-dataset-replicas-ports';

export default class ListDatasetReplicasPresenter
    extends BaseStreamingPresenter<ListDatasetReplicasResponse, ListDatasetReplicasError, DIDDatasetReplicasViewModel>
    implements ListDatasetReplicasOutputPort
{
    streamResponseModelToViewModel(responseModel: ListDatasetReplicasResponse): DIDDatasetReplicasViewModel {
        const viewModel: DIDDatasetReplicasViewModel = {
            rseblocked: 0, // Needs a rucio endpoint and probably a post processing pipeline
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListDatasetReplicasError): DIDDatasetReplicasViewModel {
        const errorViewModel: DIDDatasetReplicasViewModel = generateEmptyDIDDatasetReplicasViewModel();
        errorViewModel.status = 'error';
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }

    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model that represents the error model.
     */
    convertErrorModelToViewModel(errorModel: ListDatasetReplicasError): { viewModel: DIDDatasetReplicasViewModel; status: number } {
        const viewModel: DIDDatasetReplicasViewModel = generateEmptyDIDDatasetReplicasViewModel();
        // gateway errors
        const message = errorModel.message ? errorModel.message.toString() : errorModel.name;
        viewModel.message = message;
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
