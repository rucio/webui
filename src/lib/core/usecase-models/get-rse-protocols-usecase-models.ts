import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { RSEProtocol } from "../entity/rucio"
/**
 * @interface GetRSEProtocolsRequest represents the RequestModel for get_rse_protocols usecase
*/
export interface GetRSEProtocolsRequest {
    rseName: string
}

/** 
 * @interface GetRSEProtocolsResponse represents the ResponseModel for get_rse_protocols usecase
*/
export interface GetRSEProtocolsResponse extends BaseResponseModel {
    protocols: RSEProtocol[]
}


/**
* @interface GetRSEProtocolsError represents the ErrorModel for get_rse_protocols usecase
*/
export interface GetRSEProtocolsError extends BaseErrorResponseModel {}