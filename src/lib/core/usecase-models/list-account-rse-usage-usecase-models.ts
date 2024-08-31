import {BaseErrorResponseModel, BaseResponseModel} from "@/lib/sdk/usecase-models"
import {RSEAccountUsage} from "@/lib/core/entity/rucio";

/**
 * @interface ListAccountRSEUsageRequest represents the RequestModel for list_account_rse_usage usecase
 */
export interface ListAccountRSEUsageRequest {
    account: string
}

/**
 * @interface ListAccountRSEUsageResponse represents the ResponseModel for list_account_rse_usage usecase
 */
export interface ListAccountRSEUsageResponse extends RSEAccountUsage, BaseResponseModel {
}


/**
 * @interface ListAccountRSEUsageError represents the ErrorModel for list_account_rse_usage usecase
 */
export interface ListAccountRSEUsageError extends BaseErrorResponseModel {
}