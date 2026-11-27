import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    GetSubscriptionByIdError,
    GetSubscriptionByIdRequest,
    GetSubscriptionByIdResponse,
} from '../../usecase-models/get-subscription-by-id-usecase-models';

/**
 * @interface GetSubscriptionByIdInputPort representing the GetSubscriptionById usecase.
 */
export interface GetSubscriptionByIdInputPort extends BaseAuthenticatedInputPort<GetSubscriptionByIdRequest> {}

/**
 * @interface GetSubscriptionByIdOutputPort representing the GetSubscriptionById presenter.
 */
export interface GetSubscriptionByIdOutputPort extends BaseOutputPort<GetSubscriptionByIdResponse, GetSubscriptionByIdError> {}
