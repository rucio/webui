import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';

/**
 * @interface AddAccountAttributeRequest represents the RequestModel for add-account-attribute usecase
 */
export interface AddAccountAttributeRequest {
    account: string;
    key: string;
    value: string;
}

/**
 * @interface AddAccountAttributeResponse represents the ResponseModel for add-account-attribute usecase
 */
export interface AddAccountAttributeResponse extends BaseResponseModel {}

/**
 * @interface AddAccountAttributeError represents the ErrorModel for add-account-attribute usecase
 */
export interface AddAccountAttributeError extends BaseErrorResponseModel {}
