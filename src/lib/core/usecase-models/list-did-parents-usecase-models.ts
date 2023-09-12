import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { DID } from "../entity/rucio"
/**
 * @interface ListDIDParentsRequest represents the RequestModel for list_did_parents usecase
*/
export interface ListDIDParentsRequest {
    scope: string
    name: string
}

/** 
 * @interface ListDIDParentsResponse represents the ResponseModel for list_did_parents usecase
*/
export interface ListDIDParentsResponse extends DID, BaseResponseModel {}


/**
* @interface ListDIDParentsError represents the ErrorModel for list_did_parents usecase
*/
export interface DIDMetaError extends BaseErrorResponseModel {}