import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    ListAccountAttributesError,
    ListAccountAttributesRequest,
    ListAccountAttributesResponse,
} from '@/lib/core/usecase-models/list-account-attributes-usecase-models';

/**
 * @interface ListAccountAttributesInputPort representing the ListAccountAttributes usecase.
 */
export interface ListAccountAttributesInputPort extends BaseAuthenticatedInputPort<ListAccountAttributesRequest> {}

/**
 * @interface ListAccountAttributesOutputPort representing the ListAccountAttributes presenter.
 */
export interface ListAccountAttributesOutputPort extends BaseOutputPort<ListAccountAttributesResponse, ListAccountAttributesError> {}
