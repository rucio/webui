import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models";
import { DIDExtendedDTO } from "../dto/did-dto";
import { DID, DIDLong, RSEAccountUsage } from "../entity/rucio";

/**
 * @interface ListAccountRSEQuotasRequest represents the ListAccountRSEQuotas request model for a streamed element.
 */
export interface ListAccountRSEQuotasRequest {
    account: string;
    requestedDIDs: DIDLong[];
}

/**
 * @interface ListAccountRSEQuotasResponse represents the ListAccountRSEQuotas response model for a streamed element.
 */
export interface ListAccountRSEQuotasResponse extends RSEAccountUsage, BaseResponseModel {}


/**
 * @interface ListAccountRSEQuotasError represents the ListAccountRSEQuotas error model for a streamed element.
 * @property error - Error Message contains error from gateway unless the following type of error occurs:
 * INVALID_ACCOUNT: The account specified in the request is not same as the account present in the session
 */
export interface ListAccountRSEQuotasError extends BaseErrorResponseModel {
    error: 'INVALID_ACCOUNT' | string
}