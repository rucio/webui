import { injectable, inject } from 'inversify';
import { Signal } from '@/lib/sdk/web';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { BaseController, TAuthenticatedControllerParameters } from '@/lib/sdk/controller';
import { GetPandaTaskLinkRequest } from '@/lib/core/usecase-models/get-panda-task-link-usecase-models';
import { GetPandaTaskLinkInputPort } from '@/lib/core/port/primary/get-panda-task-link-ports';
import USECASE_FACTORY from '@/lib/infrastructure/ioc/ioc-symbols-usecase-factory';

export type GetPandaTaskLinkControllerParameters = TAuthenticatedControllerParameters & {
    taskId: string;
};

@injectable()
class GetPandaTaskLinkController extends BaseController<GetPandaTaskLinkControllerParameters, AuthenticatedRequestModel<GetPandaTaskLinkRequest>> {
    constructor(@inject(USECASE_FACTORY.GET_PANDA_TASK_LINK) GetPandaTaskLinkUseCaseFactory: (response: Signal) => GetPandaTaskLinkInputPort) {
        super(GetPandaTaskLinkUseCaseFactory);
    }

    prepareRequestModel(parameters: GetPandaTaskLinkControllerParameters): AuthenticatedRequestModel<GetPandaTaskLinkRequest> {
        return {
            rucioAuthToken: parameters.rucioAuthToken,
            taskId: parameters.taskId,
        };
    }
}

export default GetPandaTaskLinkController;
