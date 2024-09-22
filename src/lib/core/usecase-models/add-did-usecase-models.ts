import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
/**
 * @interface AddDIDRequest represents the RequestModel for add_did usecase
*/
export interface AddDIDRequest {
    scope: string;
    name: string;
    type: string;
}

/** 
 * @interface AddDIDResponse represents the ResponseModel for add_did usecase
*/
export interface AddDIDResponse extends BaseResponseModel {
}


/**
* @interface AddDIDError represents the ErrorModel for add_did usecase
*/
export interface AddDIDError extends BaseErrorResponseModel {
}