import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { IdentityType } from '@/lib/core/entity/account';

/**
 * @interface AddAccountIdentityRequest represents the RequestModel for add-account-identity usecase
 */
export interface AddAccountIdentityRequest {
    account: string;
    identity: string;
    authType: IdentityType;
    email: string;
    password?: string;
    isDefault?: boolean;
}

/**
 * @interface AddAccountIdentityResponse represents the ResponseModel for add-account-identity usecase
 */
export interface AddAccountIdentityResponse extends BaseResponseModel {}

/**
 * @interface AddAccountIdentityError represents the ErrorModel for add-account-identity usecase
 */
export interface AddAccountIdentityError extends BaseErrorResponseModel {}
