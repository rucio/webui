import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    AddAccountIdentityError,
    AddAccountIdentityRequest,
    AddAccountIdentityResponse,
} from '@/lib/core/usecase-models/add-account-identity-usecase-models';

/**
 * @interface AddAccountIdentityInputPort representing the AddAccountIdentity usecase.
 */
export interface AddAccountIdentityInputPort extends BaseAuthenticatedInputPort<AddAccountIdentityRequest> {}

/**
 * @interface AddAccountIdentityOutputPort representing the AddAccountIdentity presenter.
 */
export interface AddAccountIdentityOutputPort extends BaseOutputPort<AddAccountIdentityResponse, AddAccountIdentityError> {}
