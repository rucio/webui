import {
    ListSuspiciousReplicasError,
    ListSuspiciousReplicasResponse,
} from '@/lib/core/usecase-models/list-suspicious-replicas-usecase-models';
import { SuspiciousReplicaViewModel, generateEmptySuspiciousReplicaViewModel } from '@/lib/infrastructure/data/view-model/replica';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { ListSuspiciousReplicasOutputPort } from '@/lib/core/port/primary/list-suspicious-replicas-ports';

export default class ListSuspiciousReplicasPresenter
    extends BaseStreamingPresenter<ListSuspiciousReplicasResponse, ListSuspiciousReplicasError, SuspiciousReplicaViewModel>
    implements ListSuspiciousReplicasOutputPort
{
    streamResponseModelToViewModel(responseModel: ListSuspiciousReplicasResponse): SuspiciousReplicaViewModel {
        const viewModel: SuspiciousReplicaViewModel = {
            status: 'success',
            scope: responseModel.scope,
            name: responseModel.name,
            rse: responseModel.rse,
            rseId: responseModel.rseId,
            cnt: responseModel.cnt,
            createdAt: responseModel.createdAt,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListSuspiciousReplicasError): SuspiciousReplicaViewModel {
        const errorViewModel: SuspiciousReplicaViewModel = generateEmptySuspiciousReplicaViewModel();
        errorViewModel.status = 'error';
        errorViewModel.message = `${error.name}: ${error.message}`;
        errorViewModel.errorType = 'gateway_error';
        return errorViewModel;
    }

    convertErrorModelToViewModel(errorModel: ListSuspiciousReplicasError): { viewModel: SuspiciousReplicaViewModel; status: number } {
        const viewModel: SuspiciousReplicaViewModel = generateEmptySuspiciousReplicaViewModel();
        const message = errorModel.message ? errorModel.message.toString() : errorModel.name;
        viewModel.message = message;
        viewModel.errorType = 'gateway_error';
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
