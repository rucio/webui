import { BaseErrorResponseModel, BaseResponseModel } from "@/lib/sdk/usecase-models"
import { Rule, RuleState } from "../entity/rucio";
/**
 * @interface ListRulesForAccountRequest represents the RequestModel for list_rules_for_account usecase
*/
export interface ListRulesForAccountRequest {
    account: string;
    rseExpression: string;
    activity: string;
    ruleState: RuleState;
    from: Date;
    to: Date;
}

/** 
 * @interface ListRulesForAccountResponse represents the ResponseModel for list_rules_for_account usecase
*/

export interface ListRulesForAccountResponse extends BaseResponseModel, Rule {
}


/**
* @interface ListRulesForAccountError represents the ErrorModel for list_rules_for_account usecase
*/
export interface ListRulesForAccountError extends BaseErrorResponseModel {}