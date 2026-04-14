import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { UpdateRuleError, UpdateRuleRequest, UpdateRuleResponse } from '@/lib/core/usecase-models/update-rule-usecase-models';

/**
 * @interface UpdateRuleInputPort representing the UpdateRule usecase.
 */
export interface UpdateRuleInputPort extends BaseAuthenticatedInputPort<UpdateRuleRequest> {}

/**
 * @interface UpdateRuleOutputPort representing the UpdateRule presenter.
 */
export interface UpdateRuleOutputPort extends BaseOutputPort<UpdateRuleResponse, UpdateRuleError> {}
