import { BasePresenter } from '@/lib/sdk/presenter';
import { GetPandaTaskLinkError, GetPandaTaskLinkResponse } from '@/lib/core/usecase-models/get-panda-task-link-usecase-models';
import { PandaTaskLinkViewModel } from '../data/view-model/panda';

export default class GetPandaTaskLinkPresenter extends BasePresenter<GetPandaTaskLinkResponse, GetPandaTaskLinkError, PandaTaskLinkViewModel> {
    convertResponseModelToViewModel(responseModel: GetPandaTaskLinkResponse): { viewModel: PandaTaskLinkViewModel; status: number } {
        return {
            status: 200,
            viewModel: { status: 'success', taskId: responseModel.taskId, url: responseModel.url },
        };
    }

    convertErrorModelToViewModel(errorModel: GetPandaTaskLinkError): { viewModel: PandaTaskLinkViewModel; status: number } {
        const viewModel: PandaTaskLinkViewModel = {
            status: 'error',
            taskId: '',
            url: '',
            message: errorModel.message || errorModel.name,
            errorType: errorModel.type === 'InvalidTaskIdError' ? 'invalid_task_id' : 'unknown',
        };
        return {
            status: errorModel.code || 500,
            viewModel,
        };
    }
}
