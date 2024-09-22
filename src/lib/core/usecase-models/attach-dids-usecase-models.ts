import {BaseErrorResponseModel, BaseResponseModel} from "@/lib/sdk/usecase-models"

/**
 * @interface AttachDIDsRequest represents the RequestModel for attach_dids usecase
 */
export interface AttachDIDsRequest {
    scope: string;
    name: string;
    dids: {
        scope: string;
        name: string;
    }[],
}

/**
 * @interface AttachDIDsResponse represents the ResponseModel for attach_dids usecase
 */
export interface AttachDIDsResponse extends BaseResponseModel {
    created: boolean;
}


/**
 * @interface AttachDIDsError represents the ErrorModel for attach_dids usecase
 */
export interface AttachDIDsError extends BaseErrorResponseModel {
}