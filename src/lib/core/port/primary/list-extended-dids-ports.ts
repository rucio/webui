import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from '@/lib/sdk/primary-ports';
import {
    ListExtendedDIDsError,
    ListExtendedDIDsRequest,
    ListExtendedDIDsResponse,
} from '@/lib/core/usecase-models/list-extended-dids-usecase-models';
import { ListExtendedDIDsViewModel } from '@/lib/infrastructure/data/view-model/list-did';

/**
 * @interface ListExtendedDIDsInputPort representing the ListExtendedDIDs usecase.
 */
export interface ListExtendedDIDsInputPort extends BaseAuthenticatedInputPort<ListExtendedDIDsRequest> {}

/**
 * @interface ListExtendedDIDsOutputPort representing the ListExtendedDIDs presenter.
 */
export interface ListExtendedDIDsOutputPort
    extends BaseStreamingOutputPort<ListExtendedDIDsResponse, ListExtendedDIDsError, ListExtendedDIDsViewModel> {}
