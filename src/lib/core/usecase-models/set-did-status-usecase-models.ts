import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
/**
 * @interface SetDIDStatusRequest represents the RequestModel for set_did_status usecase
 */
export interface SetDIDStatusRequest {
    scope: string;
    name: string;
    open: boolean;
}

/**
 * @interface SetDIDStatusResponse represents the ResponseModel for set_did_status usecase
 */
export interface SetDIDStatusResponse extends BaseResponseModel {}

/**
 * @interface SetDIDStatusError represents the ErrorModel for set_did_status usecase
 */
export interface SetDIDStatusError extends BaseErrorResponseModel {}
