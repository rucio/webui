import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    AddAccountAttributeError,
    AddAccountAttributeRequest,
    AddAccountAttributeResponse,
} from '@/lib/core/usecase-models/add-account-attribute-usecase-models';

/**
 * @interface AddAccountAttributeInputPort representing the AddAccountAttribute usecase.
 */
export interface AddAccountAttributeInputPort extends BaseAuthenticatedInputPort<AddAccountAttributeRequest> {}

/**
 * @interface AddAccountAttributeOutputPort representing the AddAccountAttribute presenter.
 */
export interface AddAccountAttributeOutputPort extends BaseOutputPort<AddAccountAttributeResponse, AddAccountAttributeError> {}
