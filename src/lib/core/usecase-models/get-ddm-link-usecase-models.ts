import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';

/**
 * @interface GetDDMLinkRequest represents the RequestModel for get_ddm_link usecase
 */
export interface GetDDMLinkRequest {
    scope: string;
    name: string;
    rse: string;
}

/**
 * @interface GetDDMLinkResponse represents the ResponseModel for get_ddm_link usecase
 */
export interface GetDDMLinkResponse extends BaseResponseModel {
    url: string;
}

/**
 * @interface FeatureDisabledError represents an error when the DDM Dashboard feature flag is not enabled
 */
export interface FeatureDisabledError extends BaseErrorResponseModel {
    type: 'FeatureDisabledError';
}

/**
 * @interface ConfigNotFoundError represents an error when the DDM Dashboard base URL is not configured
 */
export interface ConfigNotFoundError extends BaseErrorResponseModel {
    type: 'ConfigNotFoundError';
}

/**
 * @type GetDDMLinkError is a discriminated union of all possible DDM link error types
 */
export type GetDDMLinkError = FeatureDisabledError | ConfigNotFoundError;
