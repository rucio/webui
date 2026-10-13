import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { AccountUpdateOptions } from '@/lib/core/entity/account';

/**
 * @interface UpdateAccountRequest represents the RequestModel for update-account usecase
 */
export interface UpdateAccountRequest {
    account: string;
    options: AccountUpdateOptions;
}

/**
 * @interface UpdateAccountResponse represents the ResponseModel for update-account usecase
 */
export interface UpdateAccountResponse extends BaseResponseModel {}

/**
 * @interface UpdateAccountError represents the ErrorModel for update-account usecase
 */
export interface UpdateAccountError extends BaseErrorResponseModel {}
