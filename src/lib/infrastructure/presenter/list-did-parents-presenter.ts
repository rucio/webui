import { ListDIDParentsError, ListDIDParentsResponse } from '@/lib/core/usecase-models/list-did-parents-usecase-models';
import { DIDViewModel, generateEmptyDIDViewModel } from '@/lib/infrastructure/data/view-model/did';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { ListDIDParentsOutputPort } from '@/lib/core/port/primary/list-did-parents-ports';

export default class ListDIDParentsPresenter
    extends BaseStreamingPresenter<ListDIDParentsResponse, ListDIDParentsError, DIDViewModel>
    implements ListDIDParentsOutputPort
{
    streamResponseModelToViewModel(responseModel: ListDIDParentsResponse): DIDViewModel {
        const viewModel: DIDViewModel = {
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListDIDParentsError): DIDViewModel {
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
    convertErrorModelToViewModel(errorModel: ListDIDParentsError): { viewModel: DIDViewModel; status: number } {
        const viewModel: DIDViewModel = generateEmptyDIDViewModel();
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
