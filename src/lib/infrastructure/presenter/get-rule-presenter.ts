import { BasePresenter } from '@/lib/sdk/presenter';
import { GetRuleError, GetRuleResponse } from '@/lib/core/usecase-models/get-rule-usecase-models';
import { getEmptyGetRuleViewModel, GetRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';

export default class GetRulePresenter extends BasePresenter<GetRuleResponse, GetRuleError, GetRuleViewModel> {
    convertResponseModelToViewModel(responseModel: GetRuleResponse): { viewModel: GetRuleViewModel; status: number } {
        const viewModel: GetRuleViewModel = {
            ...responseModel,
        };
        return {
            status: 200,
            viewModel: viewModel,
        };
    }

    convertErrorModelToViewModel(errorModel: GetRuleError): { viewModel: GetRuleViewModel; status: number } {
        const viewModel: GetRuleViewModel = getEmptyGetRuleViewModel();
        const message = errorModel.message || errorModel.name;
        viewModel.message = message;
        const errorCode = errorModel.code || 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
