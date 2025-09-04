import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { GetRSEError, GetRSERequest, GetRSEResponse } from '@/lib/core/usecase-models/get-rse-usecase-models';

/**
 * @interface GetRSEInputPort representing the GetRSE usecase.
 */
export interface GetRSEInputPort extends BaseAuthenticatedInputPort<GetRSERequest> {}

/**
 * @interface GetRSEOutputPort representing the GetRSE presenter.
 */
export interface GetRSEOutputPort extends BaseOutputPort<GetRSEResponse, GetRSEError> {}
