import { BasePresenter } from '@/lib/sdk/presenter';
import { UpdateRuleError, UpdateRuleResponse } from '@/lib/core/usecase-models/update-rule-usecase-models';
import { getEmptyUpdateRuleViewModel, UpdateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';

export default class UpdateRulePresenter extends BasePresenter<UpdateRuleResponse, UpdateRuleError, UpdateRuleViewModel> {
    convertResponseModelToViewModel(responseModel: UpdateRuleResponse): { viewModel: UpdateRuleViewModel; status: number } {
        const viewModel: UpdateRuleViewModel = {
            ...responseModel,
            status: 'success',
            message: 'Rule updated successfully',
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }

    convertErrorModelToViewModel(errorModel: UpdateRuleError): { viewModel: UpdateRuleViewModel; status: number } {
        const viewModel: UpdateRuleViewModel = getEmptyUpdateRuleViewModel();

        const message = errorModel.message || errorModel.name;
        viewModel.message = message;

        const errorCode = errorModel.code || 500;

        switch (errorCode) {
            case 401:
                viewModel.errorType = 'unauthorized';
                break;
            case 403:
                viewModel.errorType = 'permission_denied';
                break;
            case 404:
                viewModel.errorType = 'not_found';
                break;
            case 409:
                viewModel.errorType = 'conflict';
                break;
            default:
                viewModel.errorType = 'unknown';
                break;
        }

        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
