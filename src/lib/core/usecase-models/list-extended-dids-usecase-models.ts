import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { DIDExtended, DIDType } from '@/lib/core/entity/rucio';
/**
 * @interface ListExtendedDIDsRequest represents the RequestModel for list_extended_dids usecase
 */
export interface ListExtendedDIDsRequest {
    query: string;
    type: DIDType;
}

/**
 * @interface ListExtendedDIDsResponse represents the ResponseModel for list_extended_dids usecase
 */
export interface ListExtendedDIDsResponse extends DIDExtended, BaseResponseModel {}

/**
 * @interface ListExtendedDIDsError represents the ErrorModel for list_extended_dids usecase
 */
export interface ListExtendedDIDsError extends BaseErrorResponseModel {}
