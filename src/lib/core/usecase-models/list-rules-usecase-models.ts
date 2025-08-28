import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { Rule, RuleFilter, RuleState } from '@/lib/core/entity/rucio';

/**
 * @interface ListRulesRequest represents the RequestModel for list_rules usecase
 */
export interface ListRulesRequest {
    filters?: RuleFilter;
}

/**
 * @interface ListRulesResponse represents the ResponseModel for list_rules usecase
 */
export interface ListRulesResponse extends Rule, BaseResponseModel {}

/**
 * @interface ListRulesError represents the ErrorModel for list_rules usecase
 */
export interface ListRulesError extends BaseErrorResponseModel {}
