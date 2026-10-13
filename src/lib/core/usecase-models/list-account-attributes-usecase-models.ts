import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { AccountAttribute } from '@/lib/core/entity/account';

/**
 * @interface ListAccountAttributesRequest represents the RequestModel for list-account-attributes usecase
 */
export interface ListAccountAttributesRequest {
    account: string;
}

/**
 * @interface ListAccountAttributesResponse represents the ResponseModel for list-account-attributes usecase
 */
export interface ListAccountAttributesResponse extends BaseResponseModel {
    account: string;
    attributes: AccountAttribute[];
}

/**
 * @interface ListAccountAttributesError represents the ErrorModel for list-account-attributes usecase
 */
export interface ListAccountAttributesError extends BaseErrorResponseModel {}
