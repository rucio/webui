import { CreateRuleError, CreateRuleResponse } from '@/lib/core/usecase-models/create-rule-usecase-models';
import { NextApiResponse } from 'next';
import { CreateRuleViewModel, getEmptyCreateRuleViewModel } from '@/lib/infrastructure/data/view-model/rule';
import { BasePresenter } from '@/lib/sdk/presenter';
import { CreateRuleOutputPort } from '@/lib/core/port/primary/create-rule-ports';

export default class CreateRulePresenter
    extends BasePresenter<CreateRuleResponse, CreateRuleError, CreateRuleViewModel>
    implements CreateRuleOutputPort
{
    response: NextApiResponse<any>;

    constructor(response: NextApiResponse) {
        super(response);
        this.response = response;
    }

    convertResponseModelToViewModel(responseModel: CreateRuleResponse): { viewModel: CreateRuleViewModel; status: number } {
        return {
            status: 200,
            viewModel: {
                status: responseModel.status,
                rule_ids: responseModel.rule_ids,
            },
        };
    }

    streamResponseModelToViewModel(responseModel: CreateRuleResponse): CreateRuleViewModel {
        const viewModel: CreateRuleViewModel = {
            ...responseModel,
        };
        return viewModel;
    }

    streamErrorModelToViewModel(error: CreateRuleError): CreateRuleViewModel {
        const errorViewModel: CreateRuleViewModel = getEmptyCreateRuleViewModel();
        errorViewModel.status = 'error';
        errorViewModel.message = `${error.name}: ${error.message}`;
        return errorViewModel;
    }

    /**
     * Converts an error model to an error view model.
     * @param errorModel The error model to convert.
     * @returns The error view model that represents the error model.
     */
    convertErrorModelToViewModel(errorModel: CreateRuleError): { viewModel: CreateRuleViewModel; status: number } {
        const viewModel: CreateRuleViewModel = getEmptyCreateRuleViewModel();
        // gateway errors
        const message = errorModel.message ? errorModel.message.toString() : errorModel.name;
        const name = errorModel.name ? errorModel.name : '';
        viewModel.message = message;
        const errorCode = errorModel.code ? errorModel.code : 500;
        return {
            status: errorCode,
            viewModel: viewModel,
        };
    }
}
