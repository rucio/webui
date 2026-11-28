import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    GetFileReplicasMetalinkError,
    GetFileReplicasMetalinkRequest,
    GetFileReplicasMetalinkResponse,
} from '@/lib/core/usecase-models/get-file-replicas-metalink-usecase-models';

/**
 * @interface GetFileReplicasMetalinkInputPort representing the GetFileReplicasMetalink usecase.
 */
export interface GetFileReplicasMetalinkInputPort extends BaseAuthenticatedInputPort<GetFileReplicasMetalinkRequest> {}

/**
 * @interface GetFileReplicasMetalinkOutputPort representing the GetFileReplicasMetalink presenter.
 */
export interface GetFileReplicasMetalinkOutputPort extends BaseOutputPort<GetFileReplicasMetalinkResponse, GetFileReplicasMetalinkError> {}
