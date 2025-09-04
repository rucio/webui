import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { RSEAttribute } from '../entity/rucio';
/**
 * @interface GetRSEAttributesRequest represents the RequestModel for get_rse_attributes usecase
 */
export interface GetRSEAttributesRequest {
    rseName: string;
}

/**
 * @interface GetRSEAttributesResponse represents the ResponseModel for get_rse_attributes usecase
 */
export interface GetRSEAttributesResponse extends BaseResponseModel {
    attributes: RSEAttribute[];
}

/**
 * @interface GetRSEAttributesError represents the ErrorModel for get_rse_attributes usecase
 */
export interface GetRSEAttributesError extends BaseErrorResponseModel {}
