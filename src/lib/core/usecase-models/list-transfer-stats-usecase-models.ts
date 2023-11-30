import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";
import { RequestStats } from "../entity/rucio";

/**
 * @interface ListTransferStatsRequest repesents the RequestModel for list_transfer_stats usecase
 */
export interface ListTransferStatsRequest {}

/**
 * @interface ListTransferStatsResponse represents the ResponseModel for list_transfer_stats usecase
 */
export interface ListTransferStatsResponse extends RequestStats, BaseResponseModel {}

/**
 * @interface ListTransferStatsError represents the ErrorModel for list_transfer_stats usecase
 */
export interface ListTransferStatsError extends BaseErrorResponseModel {}