import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from "@/lib/sdk/primary-ports";
import { ListRulesForAccountResponse, ListRulesForAccountRequest, ListRulesForAccountError } from "@/lib/core/usecase-models/list-rules-for-account-usecase-models";
import { RuleViewModel } from "@/lib/infrastructure/data/view-model/rule";
/**
 * @interface ListRulesForAccountInputPort that abstracts the usecase.
 */
export interface ListRulesForAccountInputPort extends BaseAuthenticatedInputPort<ListRulesForAccountRequest> {}

/**
 * @interface ListRulesForAccountOutputPort that abtrsacts the presenter
 */
export interface ListRulesForAccountOutputPort extends BaseStreamingOutputPort<ListRulesForAccountResponse, ListRulesForAccountError, RuleViewModel> {}
