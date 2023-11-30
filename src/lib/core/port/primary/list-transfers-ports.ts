import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from "@/lib/sdk/primary-ports";
import { ListTransfersError, ListTransfersRequest, ListTransfersResponse } from "../../usecase-models/list-transfers-usecase-models";
import { TransferViewModel } from "@/lib/infrastructure/data/view-model/request";

/**
 * @interface ListTransfersInputPort that abstracts the usecase.
 */
export interface ListTransfersInputPort extends BaseAuthenticatedInputPort<ListTransfersRequest> {}

/**
 * @interface ListTransfersOutputPort that abstracts the usecase.
 */
export interface ListTransfersOutputPort extends BaseStreamingOutputPort<ListTransfersResponse, ListTransfersError, TransferViewModel> {}
