import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';

/**
 * @interface UpdateAccountAttributeRequest represents the RequestModel for update-account-attribute usecase
 */
export interface UpdateAccountAttributeRequest {
    account: string;
    key: string;
    value: string;
}

/**
 * @interface UpdateAccountAttributeResponse represents the ResponseModel for update-account-attribute usecase
 */
export interface UpdateAccountAttributeResponse extends BaseResponseModel {}

/**
 * @interface UpdateAccountAttributeError represents the ErrorModel for update-account-attribute usecase
 */
export interface UpdateAccountAttributeError extends BaseErrorResponseModel {}
