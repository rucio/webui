import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { RSE } from "@/lib/core/entity/rucio"
/**
 * @interface GetRSERequest represents the RequestModel for get_rse usecase
*/
export interface GetRSERequest {
    rseName: string
}

/** 
 * @interface GetRSEResponse represents the ResponseModel for get_rse usecase
*/
export interface GetRSEResponse extends RSE, BaseResponseModel {}


/**
* @interface GetRSEError represents the ErrorModel for get_rse usecase
*/
export interface GetRSEError extends BaseErrorResponseModel {}