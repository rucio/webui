import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    DeleteAccountLimitError,
    DeleteAccountLimitRequest,
    DeleteAccountLimitResponse,
} from '@/lib/core/usecase-models/delete-account-limit-usecase-models';

/**
 * @interface DeleteAccountLimitInputPort representing the DeleteAccountLimit usecase.
 */
export interface DeleteAccountLimitInputPort extends BaseAuthenticatedInputPort<DeleteAccountLimitRequest> {}

/**
 * @interface DeleteAccountLimitOutputPort representing the DeleteAccountLimit presenter.
 */
export interface DeleteAccountLimitOutputPort extends BaseOutputPort<DeleteAccountLimitResponse, DeleteAccountLimitError> {}
