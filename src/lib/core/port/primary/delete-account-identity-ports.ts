import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    DeleteAccountIdentityError,
    DeleteAccountIdentityRequest,
    DeleteAccountIdentityResponse,
} from '@/lib/core/usecase-models/delete-account-identity-usecase-models';

/**
 * @interface DeleteAccountIdentityInputPort representing the DeleteAccountIdentity usecase.
 */
export interface DeleteAccountIdentityInputPort extends BaseAuthenticatedInputPort<DeleteAccountIdentityRequest> {}

/**
 * @interface DeleteAccountIdentityOutputPort representing the DeleteAccountIdentity presenter.
 */
export interface DeleteAccountIdentityOutputPort extends BaseOutputPort<DeleteAccountIdentityResponse, DeleteAccountIdentityError> {}
