import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { GetRuleError, GetRuleRequest, GetRuleResponse } from '@/lib/core/usecase-models/get-rule-usecase-models';

/**
 * @interface GetRuleInputPort representing the GetRule usecase.
 */
export interface GetRuleInputPort extends BaseAuthenticatedInputPort<GetRuleRequest> {}

/**
 * @interface GetRuleOutputPort representing the GetRule presenter.
 */
export interface GetRuleOutputPort extends BaseOutputPort<GetRuleResponse, GetRuleError> {}
