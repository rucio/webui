import { TransferStatsViewModel } from "@/lib/infrastructure/data/view-model/request-stats";
import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from "@/lib/sdk/primary-ports";
import { ListTransferStatsError, ListTransferStatsRequest, ListTransferStatsResponse } from "../../usecase-models/list-transfer-stats-usecase-models";

/**
 * @interface ListTransferStatsInputPort that abstracts usecase.
 */
export interface ListTransferStatsInputPort extends BaseAuthenticatedInputPort<ListTransferStatsRequest> {}

/**
 * @interface ListTransferStatsOutputPort that abstracts usecase.
 */
export interface ListTransferStatsOutputPort extends BaseStreamingOutputPort<ListTransferStatsResponse, ListTransferStatsError, TransferStatsViewModel> {}