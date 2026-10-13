import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { AccountLimitLocality } from '@/lib/core/entity/account';

/**
 * @interface SetAccountLimitRequest represents the RequestModel for set-account-limit usecase
 */
export interface SetAccountLimitRequest {
    account: string;
    locality: AccountLimitLocality;
    rseExpression: string;
    bytes: number;
}

/**
 * @interface SetAccountLimitResponse represents the ResponseModel for set-account-limit usecase
 */
export interface SetAccountLimitResponse extends BaseResponseModel {}

/**
 * @interface SetAccountLimitError represents the ErrorModel for set-account-limit usecase
 */
export interface SetAccountLimitError extends BaseErrorResponseModel {}
