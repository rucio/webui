import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';

/**
 * @interface DeleteAccountAttributeRequest represents the RequestModel for delete-account-attribute usecase
 */
export interface DeleteAccountAttributeRequest {
    account: string;
    key: string;
}

/**
 * @interface DeleteAccountAttributeResponse represents the ResponseModel for delete-account-attribute usecase
 */
export interface DeleteAccountAttributeResponse extends BaseResponseModel {}

/**
 * @interface DeleteAccountAttributeError represents the ErrorModel for delete-account-attribute usecase
 */
export interface DeleteAccountAttributeError extends BaseErrorResponseModel {}
