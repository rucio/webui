import {BaseErrorResponseModel, BaseResponseModel} from "@/lib/sdk/usecase-models"

/**
 * @interface GetRSEUsageRequest represents the RequestModel for get_rse_usage usecase
 */
export interface GetRSEUsageRequest {
    rseName: string;
}

/**
 * @interface GetRSEUsageResponse represents the ResponseModel for get_rse_usage usecase
 */
export interface GetRSEUsageResponse extends BaseResponseModel {
    rse_id: string;
    rse: string;
    source: string;
    used: number;
    total: number;
    files: number;
    updated_at: string;
}


/**
 * @interface GetRSEUsageError represents the ErrorModel for get_rse_usage usecase
 */
export interface GetRSEUsageError extends BaseErrorResponseModel {
}