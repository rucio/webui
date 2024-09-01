import { BaseAuthenticatedInputPort, BaseOutputPort } from '@/lib/sdk/primary-ports';
import { CreateRuleSummaryError, CreateRuleSummaryRequest, CreateRuleSummaryResponse } from '../../usecase-models/create-rule-summary-usecase-models';

/**
 * @interface CreateRuleSummaryInputPort representing the CreateRuleSummary usecase.
 */
export interface CreateRuleSummaryInputPort extends BaseAuthenticatedInputPort<CreateRuleSummaryRequest> {}

/**
 * @interface CreateRuleSummaryOutputPort representing the CreateRuleSummary presenter.
 */
export interface CreateRuleSummaryOutputPort extends BaseOutputPort<CreateRuleSummaryResponse, CreateRuleSummaryError> {}
