import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { GetAMITagInfoError, GetAMITagInfoRequest, GetAMITagInfoResponse } from '@/lib/core/usecase-models/get-ami-tag-info-usecase-models';

/**
 * @interface GetAMITagInfoInputPort representing the GetAMITagInfo usecase.
 */
export interface GetAMITagInfoInputPort extends BaseAuthenticatedInputPort<GetAMITagInfoRequest> {}

/**
 * @interface GetAMITagInfoOutputPort representing the GetAMITagInfo presenter.
 */
export interface GetAMITagInfoOutputPort extends BaseOutputPort<GetAMITagInfoResponse, GetAMITagInfoError> {}
