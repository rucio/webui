import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { IdentityType } from '@/lib/core/entity/account';

/**
 * @interface DeleteAccountIdentityRequest represents the RequestModel for delete-account-identity usecase
 */
export interface DeleteAccountIdentityRequest {
    account: string;
    identity: string;
    authType: IdentityType;
}

/**
 * @interface DeleteAccountIdentityResponse represents the ResponseModel for delete-account-identity usecase
 */
export interface DeleteAccountIdentityResponse extends BaseResponseModel {}

/**
 * @interface DeleteAccountIdentityError represents the ErrorModel for delete-account-identity usecase
 */
export interface DeleteAccountIdentityError extends BaseErrorResponseModel {}
