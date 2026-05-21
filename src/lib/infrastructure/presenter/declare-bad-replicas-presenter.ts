import { BasePresenter } from '@/lib/sdk/presenter';
import {
    DeclareBadReplicasError,
    DeclareBadReplicasResponse,
} from '@/lib/core/usecase-models/declare-bad-replicas-usecase-models';
import { DeclareBadReplicasViewModel, getEmptyDeclareBadReplicasViewModel } from '@/lib/infrastructure/data/view-model/replica';

export default class DeclareBadReplicasPresenter extends BasePresenter<
    DeclareBadReplicasResponse,
    DeclareBadReplicasError,
    DeclareBadReplicasViewModel
> {
    convertResponseModelToViewModel(responseModel: DeclareBadReplicasResponse): { viewModel: DeclareBadReplicasViewModel; status: number } {
        const viewModel: DeclareBadReplicasViewModel = {
            status: 'success',
            notDeclared: responseModel.notDeclared.map(r => ({
                scope: r.scope,
                name: r.name,
                rse: r.rse,
                reason: r.reason,
            })),
        };
        return { status: 200, viewModel };
    }

    convertErrorModelToViewModel(errorModel: DeclareBadReplicasError): { viewModel: DeclareBadReplicasViewModel; status: number } {
        const viewModel: DeclareBadReplicasViewModel = getEmptyDeclareBadReplicasViewModel();
        viewModel.message = errorModel.message || errorModel.name;
        viewModel.errorType =
            (errorModel.code ?? 500) >= 400 && (errorModel.code ?? 500) < 500 && errorModel.name === 'ValidationError'
                ? 'validation_error'
                : 'gateway_error';
        const errorCode = errorModel.code || 500;
        return { status: errorCode, viewModel };
    }
}
