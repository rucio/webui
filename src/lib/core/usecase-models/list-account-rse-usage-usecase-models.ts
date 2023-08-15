import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";
import { RSEAccountUsageLimit } from "../entity/rucio";

/**
 * @interface ListAccountRSEUsageRequest represents the ListAccountRSEUsage request model for ListAccountRSEUsage feature.
 */
export interface ListAccountRSEUsageRequest {
    account: string;
}

/**
 * @interface ListAccountRSEUsageResponse represents the ListAccountRSEUsage response model for a streamed element.
 */
export interface ListAccountRSEUsageResponse extends RSEAccountUsageLimit, BaseResponseModel {}


/**
 * @interface ListAccountRSEUsageError represents the ListAccountRSEUsage error model for a streamed element.
 * @property error - Error Message contains error from gateway unless the following type of error occurs:
 * INVALID_ACCOUNT: The account specified in the request is not same as the account present in the session
 */
export interface ListAccountRSEUsageError extends BaseErrorResponseModel {
    error: 'INVALID_ACCOUNT' | string
}