import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";
import { Request } from "../entity/rucio";

/**
 * @interface ListTransfersRequest represents the RequestModel for list_transfers usecase
 */
export interface ListTransfersRequest {
    sourceRSE: string,
    destRSE: string
}

/**
 * @interface ListTransfersResponse represents the ResponseModel for list_transfers usecase
 */
export interface ListTransfersResponse extends Request, BaseResponseModel {}

/**
 * @interface ListTransfersError represents the ErrorModel for list_transfers usecase
 */
export interface ListTransfersError extends BaseErrorResponseModel {}