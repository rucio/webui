import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    GetSubscriptionByIdError,
    GetSubscriptionByIdRequest,
    GetSubscriptionByIdResponse,
} from '../../usecase-models/get-subscription-by-id-usecase-models';

export interface GetSubscriptionByIdInputPort extends BaseAuthenticatedInputPort<GetSubscriptionByIdRequest> {}

export interface GetSubscriptionByIdOutputPort extends BaseOutputPort<GetSubscriptionByIdResponse, GetSubscriptionByIdError> {}
