import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { RSE } from "../entity/rucio";

/**
 * @interface ListRSEsRequest represents the RequestModel for list_rses usecase
*/
export interface ListRSEsRequest {
    rseExpression: string;
}

/** 
 * @interface ListRSEsResponse represents the ResponseModel for list_rses usecase
*/
export interface ListRSEsResponse extends RSE, BaseResponseModel {}


/**
* @interface ListRSEsError represents the ErrorModel for list_rses usecase
*/
export interface ListRSEsError extends BaseErrorResponseModel {}