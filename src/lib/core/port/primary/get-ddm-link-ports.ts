import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { GetDDMLinkError, GetDDMLinkRequest, GetDDMLinkResponse } from '@/lib/core/usecase-models/get-ddm-link-usecase-models';

/**
 * @interface GetDDMLinkInputPort representing the GetDDMLink usecase.
 */
export interface GetDDMLinkInputPort extends BaseAuthenticatedInputPort<GetDDMLinkRequest> {}

/**
 * @interface GetDDMLinkOutputPort representing the GetDDMLink presenter.
 */
export interface GetDDMLinkOutputPort extends BaseOutputPort<GetDDMLinkResponse, GetDDMLinkError> {}
