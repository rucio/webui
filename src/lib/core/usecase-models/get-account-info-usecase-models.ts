import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { AccountInfo } from "../entity/rucio";
/**
 * @interface GetAccountInfoRequest represents the RequestModel for get_account_info usecase
*/
export interface GetAccountInfoRequest {}

/** 
 * @interface GetAccountInfoResponse represents the ResponseModel for get_account_info usecase
*/
export interface GetAccountInfoResponse extends BaseResponseModel, AccountInfo {}


/**
* @interface GetAccountInfoError represents the ErrorModel for get_account_info usecase
*/
export interface GetAccountInfoError extends BaseErrorResponseModel {}