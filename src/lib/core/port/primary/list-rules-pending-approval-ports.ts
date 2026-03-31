import { BaseAuthenticatedInputPort, BaseStreamingOutputPort } from '@/lib/sdk/primary-ports';
import {
    ListRulesPendingApprovalResponse,
    ListRulesPendingApprovalRequest,
    ListRulesPendingApprovalError,
} from '@/lib/core/usecase-models/list-rules-pending-approval-usecase-models';
import { ApproveRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';

/**
 * @interface ListRulesPendingApprovalInputPort abstracts the usecase.
 */
export interface ListRulesPendingApprovalInputPort extends BaseAuthenticatedInputPort<ListRulesPendingApprovalRequest> {}

/**
 * @interface ListRulesPendingApprovalOutputPort abstracts the presenter.
 */
export interface ListRulesPendingApprovalOutputPort
    extends BaseStreamingOutputPort<ListRulesPendingApprovalResponse, ListRulesPendingApprovalError, ApproveRuleViewModel> {}
