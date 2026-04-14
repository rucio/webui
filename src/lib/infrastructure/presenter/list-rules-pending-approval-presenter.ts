import {
    ListRulesPendingApprovalError,
    ListRulesPendingApprovalResponse,
} from '@/lib/core/usecase-models/list-rules-pending-approval-usecase-models';
import { BaseStreamingPresenter } from '@/lib/sdk/presenter';
import { ListRulesPendingApprovalOutputPort } from '@/lib/core/port/primary/list-rules-pending-approval-ports';
import { generateEmptyApproveRuleViewModel, ApproveRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';

export default class ListRulesPendingApprovalPresenter
    extends BaseStreamingPresenter<ListRulesPendingApprovalResponse, ListRulesPendingApprovalError, ApproveRuleViewModel>
    implements ListRulesPendingApprovalOutputPort
{
    streamResponseModelToViewModel(responseModel: ListRulesPendingApprovalResponse): ApproveRuleViewModel {
        const viewModel: ApproveRuleViewModel = {
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: ListRulesPendingApprovalError): ApproveRuleViewModel {
        const errorViewModel: ApproveRuleViewModel = generateEmptyApproveRuleViewModel();
        errorViewModel.status = 'error';
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }

    convertErrorModelToViewModel(errorModel: ListRulesPendingApprovalError): { viewModel: ApproveRuleViewModel; status: number } {
        const viewModel: ApproveRuleViewModel = generateEmptyApproveRuleViewModel();
        const message = errorModel.message ? errorModel.message.toString() : errorModel.name;
        viewModel.message = message;
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
