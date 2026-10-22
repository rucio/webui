import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    DeleteAccountAttributeError,
    DeleteAccountAttributeRequest,
    DeleteAccountAttributeResponse,
} from '@/lib/core/usecase-models/delete-account-attribute-usecase-models';

/**
 * @interface DeleteAccountAttributeInputPort representing the DeleteAccountAttribute usecase.
 */
export interface DeleteAccountAttributeInputPort extends BaseAuthenticatedInputPort<DeleteAccountAttributeRequest> {}

/**
 * @interface DeleteAccountAttributeOutputPort representing the DeleteAccountAttribute presenter.
 */
export interface DeleteAccountAttributeOutputPort extends BaseOutputPort<DeleteAccountAttributeResponse, DeleteAccountAttributeError> {}
