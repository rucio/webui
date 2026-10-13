import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { UpdateAccountError, UpdateAccountRequest, UpdateAccountResponse } from '@/lib/core/usecase-models/update-account-usecase-models';

/**
 * @interface UpdateAccountInputPort representing the UpdateAccount usecase.
 */
export interface UpdateAccountInputPort extends BaseAuthenticatedInputPort<UpdateAccountRequest> {}

/**
 * @interface UpdateAccountOutputPort representing the UpdateAccount presenter.
 */
export interface UpdateAccountOutputPort extends BaseOutputPort<UpdateAccountResponse, UpdateAccountError> {}
