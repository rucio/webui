import { BasePresenter } from '@/lib/sdk/presenter';
import { GetFileReplicasMetalinkError, GetFileReplicasMetalinkResponse } from '@/lib/core/usecase-models/get-file-replicas-metalink-usecase-models';
import { FileReplicasMetalinkViewModel, generateEmptyFileReplicasMetalinkViewModel } from '@/lib/infrastructure/data/view-model/replica';

export default class GetFileReplicasMetalinkPresenter extends BasePresenter<
    GetFileReplicasMetalinkResponse,
    GetFileReplicasMetalinkError,
    FileReplicasMetalinkViewModel
> {
    convertResponseModelToViewModel(responseModel: GetFileReplicasMetalinkResponse): { viewModel: FileReplicasMetalinkViewModel; status: number } {
        return { status: 200, viewModel: { status: 'success', xml: responseModel.xml } };
    }

    convertErrorModelToViewModel(errorModel: GetFileReplicasMetalinkError): { viewModel: FileReplicasMetalinkViewModel; status: number } {
        const viewModel: FileReplicasMetalinkViewModel = generateEmptyFileReplicasMetalinkViewModel();
        viewModel.message = errorModel.message || errorModel.name;
        viewModel.errorType = errorModel.errorType ?? 'unknown';
        return { status: errorModel.code || 500, viewModel };
    }
}
