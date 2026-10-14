import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { AccountIdentity } from '@/lib/core/entity/account';

/**
 * @interface ListAccountIdentitiesRequest represents the RequestModel for list-account-identities usecase
 */
export interface ListAccountIdentitiesRequest {
    account: string;
}

/**
 * @interface ListAccountIdentitiesResponse represents the ResponseModel for list-account-identities usecase
 */
export interface ListAccountIdentitiesResponse extends BaseResponseModel {
    account: string;
    identities: AccountIdentity[];
}

/**
 * @interface ListAccountIdentitiesError represents the ErrorModel for list-account-identities usecase
 */
export interface ListAccountIdentitiesError extends BaseErrorResponseModel {}
