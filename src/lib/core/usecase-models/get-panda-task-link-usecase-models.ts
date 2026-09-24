import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';

/**
 * @interface GetPandaTaskLinkRequest represents the RequestModel for get_panda_task_link usecase
 */
export interface GetPandaTaskLinkRequest {
    taskId: string;
}

/**
 * @interface GetPandaTaskLinkResponse represents the ResponseModel for get_panda_task_link usecase
 */
export interface GetPandaTaskLinkResponse extends BaseResponseModel {
    taskId: string;
    url: string;
}

/**
 * @interface InvalidTaskIdError represents a task id that is not 1 to 12 digits
 */
export interface InvalidTaskIdError extends BaseErrorResponseModel {
    type: 'InvalidTaskIdError';
}

/**
 * @type GetPandaTaskLinkError is a discriminated union of all possible PanDA task link error types
 */
export type GetPandaTaskLinkError = InvalidTaskIdError;
