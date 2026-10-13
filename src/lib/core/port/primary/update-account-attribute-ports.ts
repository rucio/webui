import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    UpdateAccountAttributeError,
    UpdateAccountAttributeRequest,
    UpdateAccountAttributeResponse,
} from '@/lib/core/usecase-models/update-account-attribute-usecase-models';

/**
 * @interface UpdateAccountAttributeInputPort representing the UpdateAccountAttribute usecase.
 */
export interface UpdateAccountAttributeInputPort extends BaseAuthenticatedInputPort<UpdateAccountAttributeRequest> {}

/**
 * @interface UpdateAccountAttributeOutputPort representing the UpdateAccountAttribute presenter.
 */
export interface UpdateAccountAttributeOutputPort extends BaseOutputPort<UpdateAccountAttributeResponse, UpdateAccountAttributeError> {}
