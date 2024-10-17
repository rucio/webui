import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { RuleMeta } from '@/lib/core/entity/rucio';
/**
 * @interface GetRuleRequest represents the RequestModel for get_rule usecase
 */
export interface GetRuleRequest {
    id: string;
}

/**
 * @interface GetRuleResponse represents the ResponseModel for get_rule usecase
 */
export interface GetRuleResponse extends BaseResponseModel, RuleMeta {}

/**
 * @interface GetRuleError represents the ErrorModel for get_rule usecase
 */
export interface GetRuleError extends BaseErrorResponseModel {}
