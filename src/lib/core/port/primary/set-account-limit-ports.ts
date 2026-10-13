import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { SetAccountLimitError, SetAccountLimitRequest, SetAccountLimitResponse } from '@/lib/core/usecase-models/set-account-limit-usecase-models';

/**
 * @interface SetAccountLimitInputPort representing the SetAccountLimit usecase.
 */
export interface SetAccountLimitInputPort extends BaseAuthenticatedInputPort<SetAccountLimitRequest> {}

/**
 * @interface SetAccountLimitOutputPort representing the SetAccountLimit presenter.
 */
export interface SetAccountLimitOutputPort extends BaseOutputPort<SetAccountLimitResponse, SetAccountLimitError> {}
