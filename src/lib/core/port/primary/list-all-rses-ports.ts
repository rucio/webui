import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from "@/lib/sdk/primary-ports";
import { ListAllRSEsResponse, ListAllRSEsRequest, ListAllRSEsError } from "@/lib/core/usecase-models/list-all-rses-usecase-models";
import { RSEViewModel } from "@/lib/infrastructure/data/view-model/rse";

/**
 * @interface ListAllRSEsInputPort that abstracts the usecase.
 */
export interface ListAllRSEsInputPort extends BaseAuthenticatedInputPort<ListAllRSEsRequest> {}

/**
 * @interface ListAllRSEsOutputPort that abtrsacts the presenter
 */
export interface ListAllRSEsOutputPort extends BaseStreamingOutputPort<ListAllRSEsResponse, ListAllRSEsError, RSEViewModel> {}
