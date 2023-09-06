import { BaseStreamingOutputPort, BaseAuthenticatedInputPort } from "@/lib/sdk/primary-ports";
import { ListDIDsRequest, ListDIDsError, ListDIDsResponse } from "@/lib/core/usecase-models/list-dids-usecase-models";
import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did";

/**
 * @interface ListDIDsInputPort to fetch a list of DIDs from the backend.
 */
export interface ListDIDsInputPort extends BaseAuthenticatedInputPort<ListDIDsRequest> {}

/**
 * @interface ListDIDsOutputPort to stream a list of DIDs to the frontend.
 */
export interface ListDIDsOutputPort extends BaseStreamingOutputPort<ListDIDsResponse, ListDIDsError, ListDIDsViewModel> {}
