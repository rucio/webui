import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { AccountType } from '@/lib/core/entity/rucio';

/**
 * @interface CreateAccountRequest represents the RequestModel for create-account usecase
 */
export interface CreateAccountRequest {
    account: string;
    accountType: AccountType;
    email: string | null;
}

/**
 * @interface CreateAccountResponse represents the ResponseModel for create-account usecase
 */
export interface CreateAccountResponse extends BaseResponseModel {
    account: string;
}

/**
 * @interface CreateAccountError represents the ErrorModel for create-account usecase
 */
export interface CreateAccountError extends BaseErrorResponseModel {}
