import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { AccountGlobalQuota, AccountLocalQuota } from '@/lib/core/entity/account';

/**
 * @interface GetAccountQuotasRequest represents the RequestModel for get_account_quotas usecase
 */
export interface GetAccountQuotasRequest {
    account: string;
}

/**
 * @interface GetAccountQuotasResponse represents the ResponseModel for get_account_quotas usecase
 */
export interface GetAccountQuotasResponse extends BaseResponseModel {
    account: string;
    local: AccountLocalQuota[];
    global: AccountGlobalQuota[];
    /** Rucio's message when it could not list the global quotas (a stored expression matches no RSEs); global is then empty. */
    globalError?: string;
}

/**
 * @interface GetAccountQuotasError represents the ErrorModel for get_account_quotas usecase
 */
export interface GetAccountQuotasError extends BaseErrorResponseModel {}
