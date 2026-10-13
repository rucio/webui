import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { DeleteAccountError, DeleteAccountRequest, DeleteAccountResponse } from '@/lib/core/usecase-models/delete-account-usecase-models';

/**
 * @interface DeleteAccountInputPort representing the DeleteAccount usecase.
 */
export interface DeleteAccountInputPort extends BaseAuthenticatedInputPort<DeleteAccountRequest> {}

/**
 * @interface DeleteAccountOutputPort representing the DeleteAccount presenter.
 */
export interface DeleteAccountOutputPort extends BaseOutputPort<DeleteAccountResponse, DeleteAccountError> {}
