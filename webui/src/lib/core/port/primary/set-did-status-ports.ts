import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { SetDIDStatusError, SetDIDStatusRequest, SetDIDStatusResponse } from '@/lib/core/usecase-models/set-did-status-usecase-models';

/**
 * @interface SetDIDStatusInputPort representing the SetDIDStatus usecase.
 */
export interface SetDIDStatusInputPort extends BaseAuthenticatedInputPort<SetDIDStatusRequest> {}

/**
 * @interface SetDIDStatusOutputPort representing the SetDIDStatus presenter.
 */
export interface SetDIDStatusOutputPort extends BaseOutputPort<SetDIDStatusResponse, SetDIDStatusError> {}
