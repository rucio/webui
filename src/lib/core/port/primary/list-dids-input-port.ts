import { BaseInputPort } from "../../../common/base-components/primary-ports";
import { ListDIDsRequest, ListDIDsResponse } from "../../data/usecase-models/list-dids-usecase-models";

/**
 * @interface ListDIDsInputPort to fetch a list of DIDs from the backend.
 */
export default interface ListDIDsInputPort extends BaseInputPort<ListDIDsRequest> {}