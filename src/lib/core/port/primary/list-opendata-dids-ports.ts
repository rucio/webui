import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import {
    ListOpenDataDIDsError,
    ListOpenDataDIDsRequest,
    ListOpenDataDIDsResponse,
} from '@/lib/core/usecase-models/list-opendata-dids-usecase-models';

export interface ListOpenDataDIDsInputPort extends BaseAuthenticatedInputPort<ListOpenDataDIDsRequest> {}

export interface ListOpenDataDIDsOutputPort extends BaseOutputPort<ListOpenDataDIDsResponse, ListOpenDataDIDsError> {}
