import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from "@/lib/sdk/primary-ports";
import { ListRSEsResponse, ListRSEsRequest, ListRSEsError } from "@/lib/core/usecase-models/list-rses-usecase-models";
import { RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";
/**
 * @interface ListRSEsInputPort that abstracts the usecase.
 */
export interface ListRSEsInputPort extends BaseAuthenticatedInputPort<ListRSEsRequest> {}

/**
 * @interface ListRSEsOutputPort that abtrsacts the presenter
 */
export interface ListRSEsOutputPort extends BaseStreamingOutputPort<ListRSEsResponse, ListRSEsError, RSEViewModel> {}
