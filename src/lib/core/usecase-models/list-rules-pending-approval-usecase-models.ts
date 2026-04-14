import { BaseErrorResponseModel, BaseResponseModel } from '@/lib/sdk/usecase-models';
import { DIDType, Rule, RuleFilter, RuleGrouping } from '@/lib/core/entity/rucio';

/**
 * @interface ListRulesPendingApprovalRequest represents the RequestModel for list_rules_pending_approval usecase
 */
export interface ListRulesPendingApprovalRequest {
    filters?: RuleFilter;
}

/**
 * @interface ListRulesPendingApprovalResponse represents the ResponseModel for list_rules_pending_approval usecase.
 * Extends the base Rule fields with additional metadata from the Rucio response and DID enrichment.
 */
export interface ListRulesPendingApprovalResponse extends Rule, BaseResponseModel {
    did_type: DIDType;
    grouping: RuleGrouping;
    comments: string | null;
    bytes: number | null;
    length: number;
    open: boolean;
}

/**
 * @interface ListRulesPendingApprovalError represents the ErrorModel for list_rules_pending_approval usecase
 */
export interface ListRulesPendingApprovalError extends BaseErrorResponseModel {
    error?: string;
}
