import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from "@/lib/sdk/primary-ports";
import { ListRSEsError, ListRSEsRequest, ListRSEsResponse } from "../../usecase-models/list-rse-usecase-models";
import { ListRSEsViewModel } from "@/lib/infrastructure/data/view-model/list-rse";

/** 
 * @interface ListRSEsInputPort to fetch a list of RSEs from the backend.
 */
export interface ListRSEsInputPort extends BaseAuthenticatedInputPort<ListRSEsRequest> { }

/**
 * @interface ListRSEsOutputPort to stream a list of RSEs to the frontend.
 */
export interface ListRSEsOutputPort extends BaseStreamingOutputPort<ListRSEsResponse, ListRSEsError, ListRSEsViewModel> { }