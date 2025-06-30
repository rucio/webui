import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';

/**
 * @interface GetFTSLinkRequest represents the RequestModel for get_fts_link usecase
 */
export interface GetFTSLinkRequest {
    scope: string;
    name: string;
    rse: string;
}

/**
 * @interface GetFTSLinkResponse represents the ResponseModel for get_fts_link usecase
 */
export interface GetFTSLinkResponse extends BaseResponseModel {
    url: string;
}

/**
 * @interface GetFTSLinkError represents the ErrorModel for get_fts_link usecase
 */
export interface GetFTSLinkError extends BaseErrorResponseModel {}
