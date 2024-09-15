import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from '@/lib/sdk/primary-ports';
import { ListRulesResponse, ListRulesRequest, ListRulesError } from '@/lib/core/usecase-models/list-rules-usecase-models';
import { RuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
/**
 * @interface ListRulesInputPort that abstracts the usecase.
 */
export interface ListRulesInputPort extends BaseAuthenticatedInputPort<ListRulesRequest> {}

// TODO: Add viewmodel
/**
 * @interface ListRulesOutputPort that abtrsacts the presenter
 */
export interface ListRulesOutputPort extends BaseStreamingOutputPort<ListRulesResponse, ListRulesError, RuleViewModel> {}
