import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { CreateAccountError, CreateAccountRequest, CreateAccountResponse } from '@/lib/core/usecase-models/create-account-usecase-models';

/**
 * @interface CreateAccountInputPort representing the CreateAccount usecase.
 */
export interface CreateAccountInputPort extends BaseAuthenticatedInputPort<CreateAccountRequest> {}

/**
 * @interface CreateAccountOutputPort representing the CreateAccount presenter.
 */
export interface CreateAccountOutputPort extends BaseOutputPort<CreateAccountResponse, CreateAccountError> {}
