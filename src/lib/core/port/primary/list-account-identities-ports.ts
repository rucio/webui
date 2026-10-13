import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    ListAccountIdentitiesError,
    ListAccountIdentitiesRequest,
    ListAccountIdentitiesResponse,
} from '@/lib/core/usecase-models/list-account-identities-usecase-models';

/**
 * @interface ListAccountIdentitiesInputPort representing the ListAccountIdentities usecase.
 */
export interface ListAccountIdentitiesInputPort extends BaseAuthenticatedInputPort<ListAccountIdentitiesRequest> {}

/**
 * @interface ListAccountIdentitiesOutputPort representing the ListAccountIdentities presenter.
 */
export interface ListAccountIdentitiesOutputPort extends BaseOutputPort<ListAccountIdentitiesResponse, ListAccountIdentitiesError> {}
