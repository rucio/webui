import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { DID } from "@/lib/core/entity/rucio";
/**
 * @interface ListDIDContentsRequest represents the RequestModel for list_did_contents usecase
*/
export interface ListDIDContentsRequest {
    scope: string;
    name: string;
}

/** 
 * @interface ListDIDContentsResponse represents the ResponseModel for list_did_contents usecase
*/
export interface ListDIDContentsResponse extends DID, BaseResponseModel {
}


/**
* @interface ListDIDContentsError represents the ErrorModel for list_did_contents usecase
*/
export interface ListDIDContentsError extends BaseErrorResponseModel {}