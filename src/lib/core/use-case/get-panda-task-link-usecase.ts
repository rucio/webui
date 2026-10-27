import { injectable } from 'inversify';
import { AuthenticatedRequestModel } from '@/lib/sdk/usecase-models';
import { GetPandaTaskLinkRequest } from '@/lib/core/usecase-models/get-panda-task-link-usecase-models';
import { GetPandaTaskLinkInputPort, type GetPandaTaskLinkOutputPort } from '@/lib/core/port/primary/get-panda-task-link-ports';
import type { ConfigReader } from '@/lib/core/entity/app-config';
import { createPandaTaskUrl, isPandaTaskId, normalizePandaBaseUrl } from '@/lib/core/utils/panda-task-utils';

@injectable()
export default class GetPandaTaskLinkUseCase implements GetPandaTaskLinkInputPort {
    constructor(private readonly presenter: GetPandaTaskLinkOutputPort, private readonly pandaBaseUrl: ConfigReader<string | undefined>) {}

    async execute(requestModel: AuthenticatedRequestModel<GetPandaTaskLinkRequest>): Promise<void> {
        const { taskId } = requestModel;

        if (!isPandaTaskId(taskId)) {
            await this.presenter.presentError({
                status: 'error',
                name: 'InvalidTaskIdError',
                type: 'InvalidTaskIdError',
                message: 'Expected a PanDA task id of 1 to 12 digits',
                code: 400,
            });
            return;
        }

        const baseUrl = normalizePandaBaseUrl(this.pandaBaseUrl());
        await this.presenter.presentSuccess({ status: 'success', taskId, url: createPandaTaskUrl(baseUrl, taskId) });
    }
}
