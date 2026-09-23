import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { AMITagDetails } from '@/lib/core/dto/ami-dto';

/**
 * @interface GetAMITagInfoRequest represents the RequestModel for get_ami_tag_info usecase
 */
export interface GetAMITagInfoRequest {
    tags: string[];
}

/**
 * One tag in the response. `url` is always set.
 * found: true = details present, false = AMI does not know the tag,
 * null = lookup failed (AMI unreachable, timeout, bad response).
 */
export interface AMITagInfo extends AMITagDetails {
    tag: string;
    url: string;
    found: boolean | null;
}

/**
 * @interface GetAMITagInfoResponse represents the ResponseModel for get_ami_tag_info usecase
 */
export interface GetAMITagInfoResponse extends BaseResponseModel {
    tags: AMITagInfo[];
}

/**
 * @interface InvalidTagsError represents an empty, oversized, or malformed tag list
 */
export interface InvalidTagsError extends BaseErrorResponseModel {
    type: 'InvalidTagsError';
}

/**
 * @type GetAMITagInfoError is a discriminated union of all possible AMI tag info error types
 */
export type GetAMITagInfoError = InvalidTagsError;
