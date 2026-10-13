import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { AccountLimitLocality } from '@/lib/core/entity/account';

/**
 * @interface DeleteAccountLimitRequest represents the RequestModel for delete-account-limit usecase
 */
export interface DeleteAccountLimitRequest {
    account: string;
    locality: AccountLimitLocality;
    rseExpression: string;
}

/**
 * @interface DeleteAccountLimitResponse represents the ResponseModel for delete-account-limit usecase
 */
export interface DeleteAccountLimitResponse extends BaseResponseModel {}

/**
 * @interface DeleteAccountLimitError represents the ErrorModel for delete-account-limit usecase
 */
export interface DeleteAccountLimitError extends BaseErrorResponseModel {}
