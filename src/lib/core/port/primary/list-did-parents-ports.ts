import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from "@/lib/sdk/primary-ports";
import { ListDIDParentsResponse, ListDIDParentsRequest, ListDIDParentsError } from "@/lib/core/usecase-models/list-did-parents-usecase-models";
import { DIDViewModel } from "@/lib/infrastructure/data/view-model/did";
/**
 * @interface ListDIDParentsInputPort that abstracts the usecase.
 */
export interface ListDIDParentsInputPort extends BaseAuthenticatedInputPort<ListDIDParentsRequest> {}

/**
 * @interface ListDIDParentsOutputPort that abtrsacts the presenter
 */
export interface ListDIDParentsOutputPort extends BaseStreamingOutputPort<ListDIDParentsResponse, ListDIDParentsError, DIDViewModel> {}
