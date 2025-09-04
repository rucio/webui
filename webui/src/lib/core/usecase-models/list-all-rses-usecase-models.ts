import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { RSE } from '@/lib/core/entity/rucio';
/**
 * @interface ListAllRSEsRequest represents the RequestModel for list_all_rses usecase
 */
export interface ListAllRSEsRequest {}

/**
 * @interface ListAllRSEsResponse represents the ResponseModel for list_all_rses usecase
 */
export interface ListAllRSEsResponse extends RSE, BaseResponseModel {}

/**
 * @interface ListAllRSEsError represents the ErrorModel for list_all_rses usecase
 */
export interface ListAllRSEsError extends BaseErrorResponseModel {}
