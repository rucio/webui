import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { GetPandaTaskLinkError, GetPandaTaskLinkRequest, GetPandaTaskLinkResponse } from '@/lib/core/usecase-models/get-panda-task-link-usecase-models';

/**
 * @interface GetPandaTaskLinkInputPort representing the GetPandaTaskLink usecase.
 */
export interface GetPandaTaskLinkInputPort extends BaseAuthenticatedInputPort<GetPandaTaskLinkRequest> {}

/**
 * @interface GetPandaTaskLinkOutputPort representing the GetPandaTaskLink presenter.
 */
export interface GetPandaTaskLinkOutputPort extends BaseOutputPort<GetPandaTaskLinkResponse, GetPandaTaskLinkError> {}
