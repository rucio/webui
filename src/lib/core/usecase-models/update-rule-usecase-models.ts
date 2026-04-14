import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { RuleUpdateOptions } from '@/lib/core/entity/rucio';

/**
 * @interface UpdateRuleRequest represents the RequestModel for update_rule usecase
 */
export interface UpdateRuleRequest {
    ruleId: string;
    options: RuleUpdateOptions;
}

/**
 * @interface UpdateRuleResponse represents the ResponseModel for update_rule usecase
 */
export interface UpdateRuleResponse extends BaseResponseModel {}

/**
 * @interface UpdateRuleError represents the ErrorModel for update_rule usecase
 */
export interface UpdateRuleError extends BaseErrorResponseModel {}
