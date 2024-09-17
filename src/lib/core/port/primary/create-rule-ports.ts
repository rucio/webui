import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { CreateRuleResponse, CreateRuleRequest, CreateRuleError } from '@/lib/core/usecase-models/create-rule-usecase-models';
/**
 * @interface CreateRuleInputPort that abstracts the usecase.
 */
export interface CreateRuleInputPort extends BaseAuthenticatedInputPort<CreateRuleRequest> {}

/**
 * @interface CreateRuleOutputPort that abtrsacts the presenter
 */
export interface CreateRuleOutputPort extends BaseOutputPort<CreateRuleResponse, CreateRuleError> {}
