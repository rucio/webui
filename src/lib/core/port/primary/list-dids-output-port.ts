import { BaseStreamingOutputPort } from "@/lib/common/base-components/primary-ports";
import { ListDIDsError, ListDIDsResponse } from "@/lib/core/data/usecase-models/list-dids-usecase-models";

export default interface ListDIDsOutputPort extends BaseStreamingOutputPort<ListDIDsResponse, ListDIDsError> {}