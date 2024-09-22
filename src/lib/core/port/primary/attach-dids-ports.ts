import { BaseAuthenticatedInputPort, BaseOutputPort } from "@/lib/sdk/primary-ports";
import { AttachDIDsError, AttachDIDsRequest, AttachDIDsResponse } from "@/lib/core/usecase-models/attach-dids-usecase-models";

/**
 * @interface AttachDIDsInputPort representing the AttachDIDs usecase.
 */
export interface AttachDIDsInputPort extends BaseAuthenticatedInputPort<AttachDIDsRequest> {}

/**
 * @interface AttachDIDsOutputPort representing the AttachDIDs presenter.
 */
export interface AttachDIDsOutputPort extends BaseOutputPort<AttachDIDsResponse, AttachDIDsError> {}
