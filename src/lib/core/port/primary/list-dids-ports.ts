import { ListDIDsViewModel } from "@/lib/infrastructure/data/view-model/list-did";
import { BaseInputPort, BaseOutputPort } from "../../base-components/ports";
import { ListDIDsError, ListDIDsResponse } from "../../data/usecase-models/list-dids-usecase-models";

export default interface ListDIDsOutputPort extends BaseOutputPort<ListDIDsResponse, ListDIDsViewModel, ListDIDsError> {}