import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { GetFTSLinkError, GetFTSLinkRequest, GetFTSLinkResponse } from '@/lib/core/usecase-models/get-fts-link-usecase-models';

/**
 * @interface GetFTSLinkInputPort representing the GetFTSLink usecase.
 */
export interface GetFTSLinkInputPort extends BaseAuthenticatedInputPort<GetFTSLinkRequest> {}

/**
 * @interface GetFTSLinkOutputPort representing the GetFTSLink presenter.
 */
export interface GetFTSLinkOutputPort extends BaseOutputPort<GetFTSLinkResponse, GetFTSLinkError> {}
