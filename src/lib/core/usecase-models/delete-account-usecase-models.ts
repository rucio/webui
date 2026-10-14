import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';

/**
 * @interface DeleteAccountRequest represents the RequestModel for delete-account usecase
 */
export interface DeleteAccountRequest {
    account: string;
}

/**
 * @interface DeleteAccountResponse represents the ResponseModel for delete-account usecase
 */
export interface DeleteAccountResponse extends BaseResponseModel {}

/**
 * @interface DeleteAccountError represents the ErrorModel for delete-account usecase
 */
export interface DeleteAccountError extends BaseErrorResponseModel {}
