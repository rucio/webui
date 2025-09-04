import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { RuleCreationParameters } from '@/lib/core/entity/rucio';

/**
 * @interface CreateRuleRequest represents the RequestModel for create_rule usecase
 */
export interface CreateRuleRequest extends RuleCreationParameters {
    sample: boolean;
    sample_file_count?: number;
}

/**
 * @interface CreateRuleResponse represents the ResponseModel for create_rule usecase
 */
export interface CreateRuleResponse extends BaseResponseModel {
    rule_ids: string[];
}

/**
 * @interface CreateRuleError represents the ErrorModel for create_rule usecase
 */
export interface CreateRuleError extends BaseErrorResponseModel {}
