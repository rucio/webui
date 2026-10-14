import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { AccountListFilter, AccountListItem } from '@/lib/core/entity/account';

/**
 * @interface ListAccountsRequest represents the RequestModel for list_accounts usecase
 */
export interface ListAccountsRequest {
    filter: AccountListFilter;
}

/**
 * @interface ListAccountsResponse represents the ResponseModel for list_accounts usecase (one streamed row)
 */
export interface ListAccountsResponse extends BaseResponseModel, AccountListItem {}

/**
 * @interface ListAccountsError represents the ErrorModel for list_accounts usecase
 */
export interface ListAccountsError extends BaseErrorResponseModel {}
