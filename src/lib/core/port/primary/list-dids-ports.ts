import { BaseAuthenticatedInputPort } from "@/lib/common/base-components/primary-ports";
import { ListDIDsRequest } from "@/lib/core/usecase-models/list-dids-usecase-models";
import { BaseStreamingOutputPort } from "@/lib/common/base-components/primary-ports";
import { ListDIDsError, ListDIDsResponse } from "@/lib/core/usecase-models/list-dids-usecase-models";

/**
 * @interface ListDIDsInputPort to fetch a list of DIDs from the backend.
 */
export interface ListDIDsInputPort extends BaseAuthenticatedInputPort<ListDIDsRequest> {}

/**
 * @interface ListDIDsOutputPort to stream a list of DIDs to the frontend.
 */
export interface ListDIDsOutputPort extends BaseStreamingOutputPort<ListDIDsResponse, ListDIDsError> {}
